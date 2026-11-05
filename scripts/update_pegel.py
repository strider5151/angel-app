#!/usr/bin/env python3
"""Sichert die Pegeldaten Bonn als Ausweichquelle, falls die App PEGELONLINE nicht direkt erreicht."""
import json, sys, datetime as dt
from pathlib import Path
import requests

ROOT = Path(__file__).resolve().parent.parent
API = "https://www.pegelonline.wsv.de/webservices/rest-api/v2/stations/"

def main():
    try:
        st = requests.get(API + "BONN.json?includeTimeseries=true&includeCurrentMeasurement=true&includeCharacteristicValues=true", timeout=30).json()
        ms = requests.get(API + "BONN/W/measurements.json?start=P7D", timeout=30).json()
    except Exception as e:
        print(f"Pegel nicht erreichbar: {e}", file=sys.stderr)
        return
    W = next((t for t in st.get("timeseries", []) if t.get("shortname") == "W"), {})
    WT = next((t for t in st.get("timeseries", []) if t.get("shortname") == "WT"), None)
    step = max(1, len(ms) // 300)
    series = [{"t": int(dt.datetime.fromisoformat(m["timestamp"]).timestamp() * 1000), "v": m["value"]} for i, m in enumerate(ms) if i % step == 0 or i == len(ms) - 1]
    try:
        a_now = requests.get(API + "ANDERNACH/W/currentmeasurement.json", timeout=30).json()
        a24 = [m["value"] for m in requests.get(API + "ANDERNACH/W/measurements.json?start=PT24H", timeout=30).json()]
    except Exception:
        a_now, a24 = None, None
    data = {"at": int(dt.datetime.now().timestamp() * 1000), "current": W.get("currentMeasurement"), "chars": W.get("characteristicValues", []),
            "series": series, "wt": WT["currentMeasurement"]["value"] if WT and WT.get("currentMeasurement") else None,
            "andernach": a_now, "andernach24": a24}
    (ROOT / "data" / "pegel.json").write_text(json.dumps(data, ensure_ascii=False), encoding="utf-8")
    print(f"OK: Pegel {data['current']['value'] if data['current'] else '?'} cm, {len(series)} Werte")

if __name__ == "__main__":
    main()
