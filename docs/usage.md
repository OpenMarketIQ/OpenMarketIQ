# Usage & API Reference

## Basic Usage

```python
from openmarketiq.api import get_cost

result = get_cost("coca cola", api_key="YOUR_PERPLEXITY_API_KEY")
print(result)
# Output: {'cost': 0.556, 'citation': 'https://fred.stlouisfed.org/series/APU0200FN1102'}
```

---

## API Reference

### `get_cost(item: str, api_key: str) -> dict`

Fetches the cost and citation for an item using the Perplexity API.

**Parameters:**
- `item` (str): The item to get the cost for (e.g., 'car', 'coca cola').
- `api_key` (str): Your Perplexity API key.

**Returns:**
- `dict` with keys:
    - `cost` (number or None)
    - `citation` (str or None)
    - `error` (str, optional)

---

## Error Handling

If the API call fails or returns an unexpected response, the result will include an `error` key:

```python
result = get_cost("invalid item", api_key="YOUR_PERPLEXITY_API_KEY")
if result.get("error"):
    print("Error:", result["error"])
```

---

## License
MIT 