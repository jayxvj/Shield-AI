# Product Requirements Document (PRD)
# Shield-AI: Real-Time Threat Sentinel & AWS S3 Archival System

> **Document Version:** 2.0 (As-Built Single-Page System)  
> **Status:** Live & Implemented  
> **System Architecture:** Decoupled Sensor Agent → FastAPI API (SSE) → AWS S3 Bucket + Relational DB → Next.js SPA  

---

## 1. Executive Summary & Product Vision

**Shield-AI** is a real-time autonomous cybersecurity threat monitoring system designed for Security Operations Centers (SOCs) and network administrators. 

### Core Motto
**"A single-pane live monitoring cockpit where every malicious network event is scored in real-time and permanently archived into an immutable AWS S3 bucket."**

Traditional security dashboards overwhelm analysts with stale tables or require complex cloud packet capture privileges. Shield-AI solves this through:
1. **Decoupled Sensor Architecture (`sensor_agent.py`)**: Runs at the network edge (physical NIC, router, or VPC gateway) to sniff and score flows without requiring elevated privileges in the cloud API container.
2. **Permanent AWS S3 Archival (`backend/s3_writer.py`)**: Every detected attack is archived in append-only JSONL format (`alerts/YYYY/MM/DD/HH/{alert_id}.jsonl`) for forensic replay, compliance, and serverless queries via AWS Athena.
3. **Single-Page Live Cockpit (`frontend/src/app/page.tsx`)**: Eliminates multi-page navigation in favor of a real-time streaming operations dashboard driven by Server-Sent Events (SSE).

---

## 2. System Architecture & Data Flow

```
┌────────────────────────────────────────────────────────────────────────┐
│                          EDGE SENSOR LAYER                             │
│  sensor_agent.py                                                       │
│    • Live Packet Sniffing (Scapy) OR High-Fidelity Attack Simulation   │
│    • Flow Aggregation Table (TCP/UDP/ICMP 5-tuple tracking)            │
│    • ML Feature Extraction (pps, bps, IAT mean/std, packet size)       │
│    • Heuristic ML Scorer & SHAP Explainer                              │
│    • Authenticated Batch Shipping (HTTPS POST with X-Sensor-Key)       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTPS Ingestion (every 2.5s)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        API & PERSISTENCE LAYER                         │
│  FastAPI Backend (backend/main.py)                                     │
│                                                                        │
│  Endpoints:                                                            │
│    • POST /api/v2/ingest       ← Validates key, stores & archives      │
│    • GET  /api/v2/stream       ← Server-Sent Events (SSE) live push    │
│    • GET  /api/v2/stats        ← 60s sliding-window telemetry          │
│    • GET  /api/v2/alerts       ← Paginated historical alerts query     │
│    • GET  /api/v2/health       ← Diagnostic deployment check           │
│    • POST /api/v2/simulate-flow← Interactive test attack trigger       │
│                                                                        │
│  Storage:                                                              │
│    • PostgreSQL / SQLite: Stored in live_alerts table                  │
│    • AWS S3 Bucket: Immutable JSONL at s3://<BUCKET>/alerts/...        │
│    • Local Fallback: ./s3_archive/ (used if AWS credentials omitted)   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Real-Time SSE Stream + REST
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    SINGLE-PAGE CLIENT DASHBOARD                        │
│  Next.js 14 App Router (frontend/src/app/page.tsx)                     │
│                                                                        │
│  • Top Telemetry Bar: Live Stream indicator, Sensor ID, S3 Bucket badge│
│  • 6 KPI Cards: Packets/s, Flows/s, Risk Score, Anomaly %, S3 Count    │
│  • Traffic Timeline Chart: Normal baseline vs. Malicious surges        │
│  • Attack Donut Chart: Real-time classification distribution           │
│  • Live Threat Feed: Real-time scrolling table with S3 archive keys    │
│  • Explainable AI (SHAP) Drawer: Feature importance & mitigation       │
│  • Deployment Verification Modal: One-click health check               │
│  • Improvement Roadmap: Actionable enterprise enhancement cards        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. AWS S3 Malicious Activity Archival Specification

### 3.1 Bucket Layout & Partitioning
- **Target Bucket**: `shield-ai-threat-archive` (configurable via `S3_BUCKET`)
- **Key Partition Pattern**:
  ```text
  s3://shield-ai-threat-archive/alerts/{YYYY}/{MM}/{DD}/{HH}/{alert_id}.jsonl
  ```
- **Partitioning Rationale**: Hourly hierarchical partitioning allows serverless tools like **AWS Athena** and **AWS Glue Crawler** to query specific time ranges with partition projection, reducing scan costs to near zero.

### 3.2 S3 Record Schema (JSONL)
Each file contains a single newline-delimited JSON line:
```json
{
  "alert_id": "LM-39104",
  "timestamp": "2026-10-06T10:45:00.123456",
  "source_ip": "185.220.101.5",
  "destination_ip": "10.0.0.1",
  "source_port": 49152,
  "destination_port": 80,
  "protocol": "TCP",
  "flow_duration_ms": 74.2,
  "bytes_transferred": 384000,
  "packets_in_flow": 910,
  "is_attack": true,
  "attack_type": "DoS",
  "confidence": 95.8,
  "risk_score": 92,
  "anomaly_score": 0.88,
  "severity": "CRITICAL",
  "shap_features": [
    {"feature": "flow_packets_per_sec", "display_name": "Flow Packets/s", "impact": 0.52, "impact_pct": 52},
    {"feature": "flow_bytes_per_sec", "display_name": "Flow Bytes/s", "impact": 0.31, "impact_pct": 31},
    {"feature": "flow_iat_mean", "display_name": "IAT Mean (us)", "impact": 0.17, "impact_pct": 17}
  ],
  "human_explanation": "Volumetric DoS flood detected from 185.220.101.5 targeting port 80.",
  "recommended_actions": [
    "Apply rate limiting for source 185.220.101.5",
    "Block IP at edge border firewall",
    "Inspect raw packet capture in S3 archive"
  ]
}
```

### 3.3 S3 Object Metadata Headers
Every object written to S3 is tagged with HTTP metadata:
- `x-amz-meta-alert-id`: Alert identifier
- `x-amz-meta-attack-type`: Classified attack category
- `x-amz-meta-severity`: Severity rating (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`)
- `x-amz-meta-risk-score`: 0–100 calculated risk score

### 3.4 Local Fallback Architecture
If `AWS_ACCESS_KEY_ID` or `AWS_SECRET_ACCESS_KEY` are not set in `.env`, the system automatically routes records to `./s3_archive/` using the exact same folder structure. This guarantees that:
- Local development never crashes.
- Test suites can run completely offline.
- Switching to AWS requires changing environment variables without modifying code.

---

## 4. Real-Time Telemetry & Threat Classification Engine

### 4.1 Feature Extraction Pipeline
Raw network flows are aggregated into 5-tuples (`src_ip`, `dst_ip`, `src_port`, `dst_port`, `protocol`) and converted into statistical feature vectors:
- `flow_packets_per_sec` (burst density)
- `flow_bytes_per_sec` (bandwidth velocity)
- `flow_iat_mean` & `flow_iat_std` (inter-arrival time regularity for beaconing detection)
- `avg_packet_size` (payload probing indicator)
- `dst_port` entropy & target matching

### 4.2 Classification Taxonomy
| Attack Category | Primary Heuristic Indicator | Action Playbook |
|---|---|---|
| **DoS** | >1,000 pkt/s or burst >50 pkts in <100ms | Enforce 100 pkt/s ingress rate limit; blackhole CIDR |
| **Port Scan** | Avg packet size <80B + short duration across varied ports | Block ingress source interface; alert IDS sensors |
| **Brute Force** | High connection count targeting ports 22, 3389, 21 | Lock targeted accounts after 5 failures; 24h IP ban |
| **Botnet / C2** | Strict IAT standard deviation (<10% of mean) indicating beaconing | Quarantine host; submit C2 IP to threat intel |
| **Data Exfiltration** | Large outbound byte volume (>500KB) with few packets | Trigger DLP alert; drop outbound transfer sessions |
| **BENIGN** | Normal packet sizes, distributed IAT, standard ports | Verified baseline (bypasses S3 archival) |

---

## 5. API Interface Specification (v2)

### 5.1 `POST /api/v2/ingest`
- **Purpose**: Ingests flow batches from `sensor_agent.py`.
- **Headers**: `X-Sensor-Key: <SENSOR_API_KEY>`
- **Request Body**:
  ```json
  {
    "sensor_id": "sensor-primary-node",
    "batch": [ /* array of LiveAlert objects */ ]
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "status": "success",
    "accepted": 20,
    "malicious_archived": 3,
    "s3_keys": ["alerts/2026/10/06/10/LM-49120.jsonl"]
  }
  ```

### 5.2 `GET /api/v2/stream` (Server-Sent Events)
- **Content-Type**: `text/event-stream`
- **Behavior**: Keeps an open HTTP socket with the browser. Pushes newly scored flows as `event: alert` in sub-second time. Sends heartbeat comments every 15s.

### 5.3 `GET /api/v2/stats`
- **Response**: Real-time sliding window stats:
  ```json
  {
    "sensor_connected": true,
    "sensor_id": "sensor-primary-node",
    "total_flows": 240,
    "normal_flows": 190,
    "suspicious_flows": 50,
    "packets_per_second": 184.2,
    "flows_per_second": 4.1,
    "top_attack_type": "DoS",
    "current_risk_score": 72,
    "anomaly_rate_pct": 20.8,
    "total_s3_archived": 50,
    "s3_bucket": "shield-ai-threat-archive",
    "timeline": [{"time": "10:45:00", "normal": 25, "suspicious": 6}]
  }
  ```

### 5.4 `GET /api/v2/health` (Deployment Check)
- **Response**: Confirms operational readiness of backend, database, S3 bucket, and sensor link:
  ```json
  {
    "status": "operational",
    "app": "Shield-AI Threat Detection System",
    "version": "2.0.0",
    "db": "ok",
    "s3": {
      "status": "ok",
      "bucket": "shield-ai-threat-archive",
      "connected": true
    },
    "sensor_connected": true,
    "total_ingested_flows": 1420,
    "total_malicious_archived": 310
  }
  ```

---

## 6. Single-Page Frontend Architecture

### 6.1 Design Philosophy
- **Zero Page Switching**: The entire monitoring and incident triage lifecycle exists in one unified viewport.
- **Real-Time Responsiveness**: Powered by `useLiveMonitor()` hook which manages the SSE stream and falls back gracefully to HTTP polling.
- **Dark Aesthetic & Visual Hierarchy**: Built using custom dark navy tones (`#0B0F19`, `#1A1F2B`) with pastel alert severity badges (`#BDD1C5` safe, `#E8B298` warning, `#A36361` critical).

### 6.2 Key Interactive Modules
1. **Header & Live Sentinel Bar**: Real-time connectivity pills, S3 bucket badge, and one-click "Verify Deployment" and "Simulate Attack" buttons.
2. **KPI Metrics Grid**: Real-time metrics for packet throughput, flow volume, 0–100 risk gauge, anomaly rate, and S3 counter.
3. **Traffic Timeline & Classification Donut**: Multi-series Recharts area chart comparing normal vs. malicious traffic alongside attack type distribution.
4. **Live Threat Feed Table**: Displays streaming alerts with direct links to the generated AWS S3 archive key.
5. **XAI (SHAP) & S3 Inspector Drawer**: Slide-over modal showing feature attribution bars, recommended playbooks, and S3 archival records.

---

## 7. Verification & Deployment Diagnostics

### Pre-Flight Smoke Test Checklist
Before exposing the service to production traffic, verify:
- [x] Backend imports cleanly and database tables auto-create on lifespan startup.
- [x] `GET /api/v2/health` returns `db: ok` and S3 status `ok` or `fallback_local`.
- [x] `sensor_agent.py` connects with `X-Sensor-Key` and pushes batches successfully.
- [x] Malicious flows generate `.jsonl` objects in S3 bucket.
- [x] Frontend `npm run build` generates clean static bundle (`12/12` pages valid).
- [x] Browser receives live alert pushes over `/api/v2/stream`.

---

## 8. Enterprise Improvement Suggestions

1. **AWS Athena Serverless SQL Analytics**:
   Create an external schema pointing to the S3 bucket:
   ```sql
   CREATE EXTERNAL TABLE IF NOT EXISTS shield_threats (
     alert_id string,
     timestamp string,
     source_ip string,
     destination_ip string,
     attack_type string,
     severity string,
     risk_score int
   )
   ROW FORMAT SERDE 'org.openx.data.jsonserde.JsonSerDe'
   LOCATION 's3://shield-ai-threat-archive/alerts/';
   ```
2. **Automated CloudWatch / SNS Alarms**:
   Add an AWS Lambda trigger on S3 `ObjectCreated` to parse CRITICAL severity objects and trigger SMS/Slack notifications.
3. **Continuous ML Retraining Loop**:
   Save analyst-verified false positives back to `s3://.../training/` and automate periodic XGBoost model fine-tuning.
4. **VPC Sensor Fleet**:
   Deploy `sensor_agent.py` across diverse cloud VPC subnets and branch office gateways for distributed, centralized threat correlation.
