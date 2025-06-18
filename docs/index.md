# OpenMarketIQ Python API

![OpenMarketIQ Logo](../assets/OpenMarketIQ%20Logo%20small.png)

A beautiful, developer-friendly Python client for fetching item cost and citation using the Perplexity API. Inspired by the OpenAI API experience.

---

## Installation

```bash
pip install openmarketiq
```

---

## Features
- Simple, single-function API
- Returns cost and citation for any item
- Clean, modern documentation

---

## Quickstart

```python
from openmarketiq.api import get_cost
result = get_cost("car", api_key="YOUR_PERPLEXITY_API_KEY")
print(result)
``` 