# OpenMarketIQ

Look up the current market price of almost anything, with a source citation, using the Perplexity API.

## Overview

OpenMarketIQ is an open-source initiative to provide real-time market values for everything, from APIs and tech tools to services and consumer goods. Given an item name (for example `car` or `coca cola`), it asks Perplexity's `sonar` model for a single numeric cost plus a citation URL, using a JSON-schema response format, and returns `{"cost": ..., "citation": ...}`.

The repository contains three pieces:

- **Python client** (`openmarketiq/`) - a single `get_cost(item, api_key)` function you can call from your own code.
- **FastAPI backend** (`get_cost_api.py`) - exposes `POST /api/get-cost` so the lookup can be used over HTTP.
- **React frontend** (`get-cost-frontend/`) - a landing page with a live API demo where users enter their own Perplexity API key and an item.

## Tech stack

- **Python client:** Python 3.7+, `requests`
- **Backend:** FastAPI, Uvicorn
- **Frontend:** React 19, TypeScript, Create React App (`react-scripts`), Tailwind CSS
- **Docs:** MkDocs (Material theme)
- **Deployment:** Render

## Project structure

```
.
├── openmarketiq/
│   └── api.py                # get_cost(item, api_key) Python client
├── get_cost_api.py           # FastAPI app: POST /api/get-cost
├── get_cost_api_wrapper.py   # Helper invoked by the API to run get_cost.py
├── get_cost.py               # Script that calls Perplexity using env vars
├── run.py                    # Starts backend + frontend together for local dev
├── get-cost-frontend/        # React + TypeScript + Tailwind frontend
├── docs/                     # MkDocs pages (index.md, usage.md)
├── mkdocs.yml
├── pyproject.toml            # Package metadata for the Python client
└── requirements.txt          # Backend dependencies
```

## Python client

### Installation

The package is not currently published on PyPI. Install it from a clone of this repository:

```bash
pip install .
```

### Usage

```python
from openmarketiq.api import get_cost

result = get_cost("car", api_key="YOUR_PERPLEXITY_API_KEY")
print(result)
# Example output: {'cost': 48699, 'citation': 'https://careedge.com/guides/new-car-price-trends-in-2025'}
```

### API reference

#### `get_cost(item: str, api_key: str) -> dict`

Fetches the cost and citation for an item using the Perplexity API.

- `item` (str): The item to get the cost for (e.g., `'car'`).
- `api_key` (str): Your Perplexity API key.

Returns a dict with keys:
- `cost` (number or None)
- `citation` (str or None)
- `error` (str, optional)

## HTTP API

`POST /api/get-cost` with a JSON body:

```json
{ "apiKey": "YOUR_PERPLEXITY_API_KEY", "item": "coca cola" }
```

Returns `{"cost": <number|null>, "citation": <string|null>}`, or a 500 response with an `error` field on failure. The caller supplies their own Perplexity API key with each request.

## Running locally

Prerequisites: Python 3 and Node.js/npm.

```bash
git clone https://github.com/OpenMarketIQ/OpenMarketIQ.git
cd OpenMarketIQ
pip install -r requirements.txt
python run.py
```

`run.py` will:
- Start the FastAPI backend at `http://localhost:8000` (with `--reload`)
- Install frontend dependencies with `npm install --legacy-peer-deps`
- Start the React app at `http://localhost:3000`

Note: the demo in `get-cost-frontend/src/App.tsx` currently calls the hosted API at `https://api.openmarketiq.org/api/get-cost`. To point the frontend at your local backend, change that URL. (`REACT_APP_API_URL` is declared in `react-app-env.d.ts` but not yet used by the app.)

### Documentation site

```bash
pip install mkdocs-material
mkdocs serve
```

## Production deployment (Render)

### Backend

- **Start command:**
  ```bash
  uvicorn get_cost_api:app --host 0.0.0.0 --port 10000
  ```

### Frontend

- **Root directory:** `get-cost-frontend`
- **Build command:**
  ```bash
  npm install --legacy-peer-deps && npm run build
  ```
- **Publish directory:** `build`

### Domain setup

- Add custom domains (e.g., `openmarketiq.org`, `api.openmarketiq.org`) through Render's domain settings.
- Update DNS settings as per Render's instructions.
- SSL is automatically managed by Render.

## Contributing

Contributions are welcome! Feel free to open issues or pull requests to improve the project.

## License

MIT - see [LICENSE](LICENSE).
