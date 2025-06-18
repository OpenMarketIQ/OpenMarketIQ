# OpenMarketIQ Python API

A simple Python client for fetching item cost and citation using the Perplexity API, inspired by the OpenAI API style.

## Installation

```bash
pip install openmarketiq
```

Or, for local development:

```bash
pip install .
```

## Usage

```python
from openmarketiq.api import get_cost

result = get_cost("car", api_key="YOUR_PERPLEXITY_API_KEY")
print(result)
# Example output: {'cost': 48699, 'citation': 'https://careedge.com/guides/new-car-price-trends-in-2025'}
```

## API Reference

### `get_cost(item: str, api_key: str) -> dict`

Fetches the cost and citation for an item using the Perplexity API.

- `item` (str): The item to get the cost for (e.g., 'car').
- `api_key` (str): Your Perplexity API key.

Returns a dict with keys:
- `cost` (number or None)
- `citation` (str or None)
- `error` (str, optional)

## License

MIT

---

# OpenMarketIQ

OpenMarketIQ is an open-source initiative to provide real-time market values for everything — from APIs and tech tools to services and consumer goods. We believe in transparency, accessibility, and empowering smarter decisions for all.

---

## 🛠 Tech Stack

- **Backend**: FastAPI (Python)
- **Frontend**: React (with Create React App)
- **Package Manager**: npm (with legacy peer deps workaround)
- **Deployment**: Render
- **Unified Script**: Python (`run.py`)

---

## 🚀 Getting Started Locally

These instructions will get your full app (backend + frontend) running locally in development mode.

### 1. Clone the repository

```bash
git clone https://github.com/your-username/OpenMarketIQ.git
cd OpenMarketIQ
```

### 2. Install Dependencies & Start the App

Make sure you have Python and Node.js installed.

```bash
python run.py
```

This will:
- Start the FastAPI backend at `http://localhost:8000`
- Install frontend dependencies with `--legacy-peer-deps`
- Start the React app at `http://localhost:3000`

---

## 🌐 Production Deployment (Render)

### Backend

- **Start Command**:
  ```bash
  uvicorn get_cost_api:app --host 0.0.0.0 --port 10000
  ```

### Frontend

- **Root Directory**: `get-cost-frontend`
- **Build Command**: 
  ```bash
  npm install --legacy-peer-deps && npm run build
  ```
- **Publish Directory**: `build`

---

## 🌍 Domain Setup

- Add custom domains (e.g., `openmarketiq.org`, `api.openmarketiq.org`) through Render's domain settings.
- Update DNS settings as per Render's instructions.
- SSL is automatically managed by Render.

---

## 📄 Environment Variables

In React (`get-cost-frontend/.env`):

```env
REACT_APP_API_URL=http://localhost:8000
```

For production (on Render), set:

```env
REACT_APP_API_URL=https://openmarketiq.onrender.com
```

---

## 📬 Contributing

We welcome contributions! Feel free to open issues or pull requests to improve the project.

---
