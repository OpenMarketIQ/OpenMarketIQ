import os
import requests
import json
import sys

# Read API key and item from environment variables
API_KEY = os.environ.get("PERPLEXITY_API_KEY")
item = os.environ.get("PERPLEXITY_ITEM")

if not API_KEY or not item:
    print(json.dumps({"cost": None, "citation": None}))
    sys.exit(1)

# Prepare the API request
url = "https://api.perplexity.ai/chat/completions"
headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}
data = {
    "model": "sonar",
    "messages": [
        {"role": "user", "content": f"What is the cost of {item}? Reply ONLY in JSON with two fields: cost (number, no currency symbol, no range, just a single number) and citation (string, the URL). Example: {{\"cost\": 35, \"citation\": \"https://example.com\"}}"}
    ],
    "response_format": {
        "type": "json_schema",
        "json_schema": {
            "schema": {
                "type": "object",
                "properties": {
                    "cost": {"type": "number"},
                    "citation": {"type": "string"}
                },
                "required": ["cost", "citation"]
            }
        }
    }
}

print(f"DEBUG: Using API_KEY={API_KEY[:6]}... and item={item}", file=sys.stderr)

# Send the request
try:
    response = requests.post(url, headers=headers, json=data)
    print(f"DEBUG: Perplexity API status={response.status_code}, response={response.text}", file=sys.stderr)
except Exception as e:
    print(json.dumps({"cost": None, "citation": None, "error": str(e)}))
    sys.exit(1)

cost = None
citation = None

if response.status_code == 200:
    try:
        result = response.json()
        answer = result["choices"][0]["message"]["content"]
        answer_json = json.loads(answer)
        cost = answer_json.get("cost")
        citation = answer_json.get("citation")
    except (KeyError, IndexError, json.JSONDecodeError):
        pass
else:
    try:
        print(json.dumps({"cost": None, "citation": None, "error": response.text}))
    except BrokenPipeError:
        try:
            sys.stderr.close()
        except Exception:
            pass
        sys.exit(0)
    sys.exit(1)

try:
    print(json.dumps({"cost": cost, "citation": citation}))
except BrokenPipeError:
    try:
        sys.stderr.close()
    except Exception:
        pass
    sys.exit(0)