from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import subprocess
import sys
import json
import tempfile
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow CORS for local frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*",
        "http://localhost:3000",
        "https://openmarketiq-frontend.onrender.com",
        "https://www.openmarketiq.org"
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CostRequest(BaseModel):
    apiKey: str
    item: str

@app.post("/api/get-cost")
async def get_cost(req: CostRequest):
    # Write a temporary Python script that takes the API key and item as input
    # and returns the cost and citation as JSON
    try:
        # Use environment variables to pass the API key and item
        env = os.environ.copy()
        env["PERPLEXITY_API_KEY"] = req.apiKey
        env["PERPLEXITY_ITEM"] = req.item
        # Call get_cost.py as a subprocess
        process = subprocess.run(
            [sys.executable, "get_cost_api_wrapper.py"],
            capture_output=True,
            text=True,
            env=env,
            timeout=30
        )
        if process.returncode != 0:
            return JSONResponse(status_code=500, content={"error": "Failed to get cost", "details": process.stderr, "stdout": process.stdout})
        try:
            data = json.loads(process.stdout)
            return data
        except Exception:
            return JSONResponse(status_code=500, content={"error": "Invalid response from script", "raw": process.stdout})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)}) 