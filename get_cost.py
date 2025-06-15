import os
import requests
import json
import re

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
    "model": "pplx-70b-online",
    "messages": [
        {"role": "user", "content": f"What is the cost of {item}? Reply with only the cost and the citation link."}
    ]
}

# Send the request
response = requests.post(url, headers=headers, json=data)

cost = None
citation = None

if response.status_code == 200:
    result = response.json()
    try:
        answer = result["choices"][0]["message"]["content"]
        # Try to extract a cost (e.g., $123.45 or 123 USD)
        cost_match = re.search(r'(\$\s?\d+[\d,.]*)|(\d+[\d,.]*\s?(USD|usd|dollars|Dollars))', answer)
        if cost_match:
            cost = cost_match.group(0).strip()
        # Try to extract a citation link (http/https URL)
        citation_match = re.search(r'(https?://\S+)', answer)
        if citation_match:
            citation = citation_match.group(0)
    except (KeyError, IndexError):
        pass
else:
    print(json.dumps({"cost": None, "citation": None}))
    exit(1)

print(json.dumps({"cost": cost, "citation": citation})) 