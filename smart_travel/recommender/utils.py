
import json
import re
import hashlib

def extract_json_from_ai(text: str) -> dict | None:
    """
    Extracts valid JSON object from LLM response text.
    """
    try:
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if not match:
            return None
        return json.loads(match.group())
    except json.JSONDecodeError:
        return None
    


import datetime


def normalize_payload(payload: dict) -> dict:
    """
    Convert non-JSON-serializable values (date, datetime) to strings
    """
    normalized = {}

    for key, value in payload.items():
        if isinstance(value, (datetime.date, datetime.datetime)):
            normalized[key] = value.isoformat()
        else:
            normalized[key] = value

    return normalized


def generate_cache_key(prefix: str, payload: dict) -> str:
    normalized_payload = normalize_payload(payload)

    serialized = json.dumps(normalized_payload, sort_keys=True)
    hash_key = hashlib.md5(serialized.encode()).hexdigest()

    return f"{prefix}:{hash_key}"
