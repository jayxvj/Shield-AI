"""
Verification test for Shield-AI v2 Live Monitoring and S3 Archival.
Uses FastAPI TestClient with lifespan context to test end-to-end functionality.
"""
import sys, os
sys.path.insert(0, os.path.abspath("."))
from fastapi.testclient import TestClient
from backend.main import app

def test_v2_system():
    with TestClient(app) as client:
        # 1. Check health
        health_resp = client.get("/api/v2/health")
        assert health_resp.status_code == 200, f"Health check failed: {health_resp.text}"
        health_data = health_resp.json()
        print("Health check passed:", health_data)
        assert health_data["status"] in ["operational", "degraded"]
        assert health_data["db"] == "ok"
        assert "s3" in health_data

        # 2. Ingest batch with 1 benign flow and 1 malicious flow (DoS attack)
        sample_batch = {
            "sensor_id": "test-sensor-node",
            "batch": [
                {
                    "alert_id": "LM-TEST01",
                    "source_ip": "192.168.1.50",
                    "destination_ip": "10.0.0.1",
                    "source_port": 54321,
                    "destination_port": 80,
                    "protocol": "TCP",
                    "flow_duration_ms": 120.0,
                    "bytes_transferred": 2500,
                    "packets_in_flow": 15,
                    "is_attack": False,
                    "attack_type": "BENIGN",
                    "confidence": 98.0,
                    "risk_score": 12,
                    "anomaly_score": 0.05,
                    "severity": "LOW",
                    "shap_features": [],
                    "human_explanation": "Normal traffic flow.",
                    "recommended_actions": [],
                },
                {
                    "alert_id": "LM-TEST02",
                    "source_ip": "185.220.101.5",
                    "destination_ip": "10.0.0.1",
                    "source_port": 49152,
                    "destination_port": 80,
                    "protocol": "TCP",
                    "flow_duration_ms": 85.0,
                    "bytes_transferred": 350000,
                    "packets_in_flow": 950,
                    "is_attack": True,
                    "attack_type": "DoS",
                    "confidence": 94.5,
                    "risk_score": 92,
                    "anomaly_score": 0.88,
                    "severity": "CRITICAL",
                    "shap_features": [
                        {"feature": "flow_packets_per_sec", "display_name": "Flow Packets/s", "impact": 0.55, "impact_pct": 55},
                        {"feature": "flow_bytes_per_sec", "display_name": "Flow Bytes/s", "impact": 0.30, "impact_pct": 30},
                    ],
                    "human_explanation": "Volumetric DoS flood detected from 185.220.101.5.",
                    "recommended_actions": ["Block source IP at edge router", "Inspect S3 archive payload"],
                }
            ]
        }

        ingest_resp = client.post("/api/v2/ingest", json=sample_batch)
        assert ingest_resp.status_code == 200, f"Ingest failed: {ingest_resp.text}"
        ingest_data = ingest_resp.json()
        print("Ingest passed:", ingest_data)
        assert ingest_data["accepted"] == 2
        assert ingest_data["malicious_archived"] == 1
        assert len(ingest_data["s3_keys"]) == 1
        archived_key = ingest_data["s3_keys"][0]
        print("Archived malicious S3 key:", archived_key)

        # 3. Check stats
        stats_resp = client.get("/api/v2/stats")
        assert stats_resp.status_code == 200
        stats_data = stats_resp.json()
        print("Stats passed:", stats_data)
        assert stats_data["total_flows"] >= 2
        assert stats_data["suspicious_flows"] >= 1
        assert stats_data["sensor_connected"] is True

        # 4. Check alerts query
        alerts_resp = client.get("/api/v2/alerts?limit=10")
        assert alerts_resp.status_code == 200
        alerts = alerts_resp.json()
        assert len(alerts) >= 2
        malicious_alert = next((a for a in alerts if a["alert_id"] == "LM-TEST02"), None)
        assert malicious_alert is not None
        assert malicious_alert["s3_key"] is not None
        print(f"Verified malicious alert has S3 key: {malicious_alert['s3_key']}")

        print("\nALL V2 SYSTEM TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_v2_system()
