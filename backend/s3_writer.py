"""
AWS S3 Archival Service for Shield-AI.
Stores each malicious activity record as an append-only JSONL object in S3.
Falls back safely to local disk archive if AWS credentials are not yet configured.
"""
from __future__ import annotations

import json
import logging
import os
from datetime import datetime
from typing import Any, Dict, Optional

from backend.config import settings

logger = logging.getLogger(__name__)

# Cache for boto3 S3 client
_s3_client: Optional[Any] = None
_s3_initialized: bool = False


def _get_s3_client():
    global _s3_client, _s3_initialized
    if _s3_initialized:
        return _s3_client

    _s3_initialized = True
    try:
        import boto3
        # Check if AWS credentials or environment variables are present
        aws_key = settings.AWS_ACCESS_KEY_ID or os.environ.get("AWS_ACCESS_KEY_ID")
        aws_secret = settings.AWS_SECRET_ACCESS_KEY or os.environ.get("AWS_SECRET_ACCESS_KEY")
        region = settings.AWS_REGION or os.environ.get("AWS_DEFAULT_REGION", "us-east-1")

        if aws_key and aws_secret:
            _s3_client = boto3.client(
                "s3",
                aws_access_key_id=aws_key,
                aws_secret_access_key=aws_secret,
                region_name=region,
            )
        else:
            # Let boto3 check default ~/.aws or IAM roles if available
            _s3_client = boto3.client("s3", region_name=region)
    except Exception as e:
        logger.info("AWS S3 client using local fallback archive (%s)", e)
        _s3_client = None

    return _s3_client


def archive_malicious_record(alert_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Archives a malicious activity record to S3 in JSONL format.
    Format: alerts/YYYY/MM/DD/HH/{alert_id}.jsonl
    """
    if not alert_data.get("is_attack", False):
        return {"status": "skipped", "reason": "benign_flow"}

    alert_id = alert_data.get("alert_id", "alert_unknown")
    now = datetime.utcnow()
    key = f"alerts/{now:%Y/%m/%d/%H}/{alert_id}.jsonl"
    bucket = settings.S3_BUCKET

    payload_line = json.dumps(alert_data, default=str) + "\n"

    client = _get_s3_client()
    if client is not None:
        try:
            client.put_object(
                Bucket=bucket,
                Key=key,
                Body=payload_line.encode("utf-8"),
                ContentType="application/x-ndjson",
                Metadata={
                    "alert_id": str(alert_id),
                    "attack_type": str(alert_data.get("attack_type", "UNKNOWN")),
                    "severity": str(alert_data.get("severity", "MEDIUM")),
                    "risk_score": str(alert_data.get("risk_score", 0)),
                },
            )
            logger.info("Archived malicious record to S3: s3://%s/%s", bucket, key)
            return {
                "status": "archived",
                "storage": "s3",
                "bucket": bucket,
                "s3_key": key,
                "url": f"https://{bucket}.s3.{settings.AWS_REGION}.amazonaws.com/{key}",
                "timestamp": now.isoformat(),
            }
        except Exception as err:
            logger.warning("Failed S3 upload, falling back to local disk archive: %s", err)

    # Local disk fallback when S3 is unavailable or credentials missing
    local_dir = os.path.join(settings.S3_LOCAL_FALLBACK_DIR, f"{now:%Y/%m/%d/%H}")
    os.makedirs(local_dir, exist_ok=True)
    local_file = os.path.join(local_dir, f"{alert_id}.jsonl")
    with open(local_file, "a", encoding="utf-8") as f:
        f.write(payload_line)

    logger.info("Archived malicious record locally: %s", local_file)
    return {
        "status": "archived",
        "storage": "local_disk_archive",
        "bucket": bucket,
        "s3_key": key,
        "local_path": local_file,
        "url": f"local://{key}",
        "timestamp": now.isoformat(),
    }


def check_s3_health() -> Dict[str, Any]:
    """Check AWS S3 connection status for deployment health checks."""
    client = _get_s3_client()
    bucket = settings.S3_BUCKET
    if client is None:
        return {
            "status": "fallback_local",
            "bucket": bucket,
            "message": "AWS S3 credentials not provided. Using persistent local archive folder.",
        }

    try:
        client.head_bucket(Bucket=bucket)
        return {"status": "ok", "bucket": bucket, "connected": True}
    except Exception as e:
        return {
            "status": "configured_error",
            "bucket": bucket,
            "connected": False,
            "error": str(e),
        }
