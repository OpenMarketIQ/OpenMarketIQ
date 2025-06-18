import requests
import json


def get_cost(item: str, api_key: str) -> dict:
    """
    Get the cost and citation for an item using the Perplexity API.

    Args:
        item (str): The item to get the cost for (e.g., 'car').
        api_key (str): Your Perplexity API key.

    Returns:
        dict: A dictionary with keys 'cost' (number or None), 'citation' (str or None), and optionally 'error' (str).
    """
    url = "https://api.perplexity.ai/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
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
    try:
        response = requests.post(url, headers=headers, json=data)
    except Exception as e:
        return {"cost": None, "citation": None, "error": str(e)}

    if response.status_code == 200:
        try:
            result = response.json()
            answer = result["choices"][0]["message"]["content"]
            answer_json = json.loads(answer)
            return {"cost": answer_json.get("cost"), "citation": answer_json.get("citation")}
        except (KeyError, IndexError, json.JSONDecodeError) as e:
            return {"cost": None, "citation": None, "error": f"Invalid response format: {e}"}
    else:
        return {"cost": None, "citation": None, "error": response.text} 