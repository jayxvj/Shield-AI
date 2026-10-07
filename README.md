# Shield-AI: Live Threat Detection & AWS S3 Archival Sentinel

Shield-AI is a real-time autonomous network threat detection and live monitoring system. Scored flows are evaluated via statistical and machine learning feature extraction, streamed in real time to a single-pane live monitoring dashboard, and every malicious activity record is archived as an immutable JSONL object into an **Amazon Web Services (AWS) S3 bucket**.

---

## 🚀 Key Features

- **Single-Page Live Threat Monitor**: Focused, single-page operations dashboard with real-time SSE telemetry push, dynamic timeline area chart, attack classification donut chart, and active risk scoring.
- **AWS S3 Malicious Activity Archival**: Every detected attack is archived to Amazon S3 in append-only JSONL format (`alerts/YYYY/MM/DD/HH/{alert_id}.jsonl`) for compliance, auditing, and serverless querying via AWS Athena. Includes automated local disk archive fallback.
- **Sensor Agent Architecture (`sensor_agent.py`)**: Solves cloud network capture constraints by decoupling packet capture from API serving. Runs on local hosts, branch routers, or VPC gateways and ships scored flow batches over authenticated HTTPS.
- **Explainable AI (SHAP Waterfall)**: Provides attribution weights for every flagged anomaly (flow packet burst rate, inter-arrival time uniformity, byte entropy, port scanning) with actionable defensive mitigation playbooks.
- **Deployment Verification Diagnostics (`/api/v2/health`)**: One-click verification that checks backend status, database persistence, S3 bucket reachability, and sensor connectivity.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       SENSOR AGENT                          │
│  (Runs on network host / gateway / VPC or in simulation)    │
│  sensor_agent.py                                            │
│    Scapy Sniff() / Simulation → Feature Extractor → ML Scorer
│    POST /api/v2/ingest (HTTPS + API Key)                    │
└──────────────────────────────┬──────────────────────────────┘
                               │ Batched Ingestion (every 3s)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      BACKEND (FastAPI)                      │
│                                                             │
│  • POST /api/v2/ingest       ← Ingests sensor flow batches  │
│  • GET  /api/v2/stream       ← Real-time SSE alert stream   │
│  • GET  /api/v2/stats        ← 60s sliding window telemetry │
│  • GET  /api/v2/alerts       ← Paginated alerts query       │
│  • GET  /api/v2/health       ← Deployment health diagnostics│
│                                                             │
│  [PostgreSQL / SQLite]       [AWS S3 Bucket Archive]        │
│  Persistent Alert Records    alerts/YYYY/MM/DD/HH/*.jsonl   │
└──────────────────────────────┬──────────────────────────────┘
                               │ SSE Stream & REST
                               ▼
┌─────────────────────────────────────────────────────────────┐
│              SINGLE-PAGE FRONTEND (Next.js 14)              │
│  • Live Telemetry KPIs (Packets/s, Flows, Risk Gauge)       │
│  • Real-time Traffic Timeline & Classification Donut        │
│  • Live Streaming Threat Table with S3 Archive Links        │
│  • XAI (SHAP) & S3 Inspector Drawer                         │
│  • Interactive Attack Simulator & S3 Archival Trigger       │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚡ Quick Start

### 1. Install Backend Dependencies
```bash
python -m pip install -r backend/requirements.txt
```

### 2. Configure Environment (`.env`)
```bash
cp .env.example .env
```
Fill in your AWS S3 and database credentials:
```env
S3_BUCKET=shield-ai-threat-archive
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_REGION=us-east-1
SENSOR_API_KEY=shield-sensor-secret-key
```
*(If AWS credentials are not set, Shield-AI automatically uses persistent local JSONL storage at `./s3_archive` without crashing).*

### 3. Run Backend Server
```bash
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```
- API Docs: `http://localhost:8000/docs`
- Health Check: `http://localhost:8000/api/v2/health`

### 4. Run Frontend Dashboard
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` to access the Single-Page Live Threat Monitor.

### 5. Start Sensor Agent (Network Telemetry)
In another terminal:
```bash
# High-fidelity realistic attack simulation mode (works anywhere without root):
python sensor_agent.py --simulate --api-url http://localhost:8000

# OR Live packet capture on network interface (requires admin/root):
python sensor_agent.py --interface eth0 --api-url http://localhost:8000
```

---

## 🛡️ S3 Archival Format

Every malicious activity record is archived as an individual JSONL line in:
`s3://<S3_BUCKET>/alerts/YYYY/MM/DD/HH/<alert_id>.jsonl`

Sample S3 JSONL payload:
```json
{
  "alert_id": "LM-48291",
  "timestamp": "2026-10-06T10:45:00.123456",
  "source_ip": "185.220.101.5",
  "destination_ip": "10.0.0.1",
  "source_port": 49152,
  "destination_port": 80,
  "protocol": "TCP",
  "flow_duration_ms": 78.4,
  "bytes_transferred": 420000,
  "packets_in_flow": 890,
  "is_attack": true,
  "attack_type": "DoS",
  "confidence": 96.2,
  "risk_score": 94,
  "anomaly_score": 0.89,
  "severity": "CRITICAL",
  "shap_features": [
    {"feature": "flow_packets_per_sec", "display_name": "Flow Packets/s", "impact": 0.52, "impact_pct": 52},
    {"feature": "flow_bytes_per_sec", "display_name": "Flow Bytes/s", "impact": 0.31, "impact_pct": 31}
  ],
  "human_explanation": "Volumetric DoS flood detected from 185.220.101.5.",
  "recommended_actions": [
    "Apply rate limiting for source 185.220.101.5",
    "Block IP at border firewall",
    "Verify packet trace in S3 archive"
  ]
}
```

---

## 💡 System Improvement Suggestions

1. **AWS Athena Query Table**: Create an Athena table partitioned by year/month/day/hour directly on the S3 bucket to run serverless SQL analytics across billions of historical threats.
2. **S3 Event-Driven Lambda Notifications**: Configure S3 ObjectCreated triggers to execute an AWS Lambda function that alerts on-call engineers via Slack/PagerDuty for CRITICAL alerts.
3. **Continuous ML Retraining Pipeline**: Build a retraining job that downloads verified false-positive/confirmed attack payloads from S3 and retrains XGBoost decision trees.
4. **VPC Sensor Fleet**: Deploy `sensor_agent.py` as a lightweight container in ECS/Kubernetes across diverse VPC subnets for multi-region perimeter monitoring.
