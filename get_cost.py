import os
import requests
import json

# Prompt user for the API key
API_KEY = input("Enter your Perplexity API key: ").strip()
if not API_KEY:
    print("Error: API key is required.")
    exit(1)

# Prompt user for the item
item = input("Enter the item you want to know the cost of: ")

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

# Send the request
response = requests.post(url, headers=headers, json=data)

cost = None
citation = None

if response.status_code == 200:
    result = response.json()
    try:
        answer = result["choices"][0]["message"]["content"]
        answer_json = json.loads(answer)
        cost = answer_json.get("cost")
        citation = answer_json.get("citation")
    except (KeyError, IndexError, json.JSONDecodeError):
        pass
else:
    print(json.dumps({"cost": None, "citation": None}))
    exit(1)

print(json.dumps({"cost": cost, "citation": citation}))