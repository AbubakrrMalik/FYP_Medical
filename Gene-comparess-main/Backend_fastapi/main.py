from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

import os
import json
import subprocess
from pathlib import Path

app = FastAPI()

PORT = 5001

# -------------------------
# CORS
# -------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"]
)

# -------------------------
# Data automation
# -------------------------

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"

REQUIRED_FILES = [
    "correlations.json",
    "drug_details.json",
    "genes_data.json",
    "drug_responses.json",
    "liver_comparison_new.json"
]

SHOULD_REBUILD = (
    "--rebuild" in os.sys.argv
    or not DATA_DIR.exists()
    or any(not (DATA_DIR / f).exists() for f in REQUIRED_FILES)
)

if SHOULD_REBUILD:

    print("Data missing or rebuild requested.")

    DATA_DIR.mkdir(exist_ok=True)

    ROOT_DIR = BASE_DIR.parent

    try:
        subprocess.run(
            ["python3", "analyze_genes.py"],
            cwd=ROOT_DIR,
            check=True
        )

        subprocess.run(
            ["python3", "export_data.py"],
            cwd=ROOT_DIR,
            check=True
        )

        subprocess.run(
            ["python3", "liver_analysis.py"],
            cwd=ROOT_DIR,
            check=True
        )

        print("Pipeline completed.")

    except Exception as e:
        print("Pipeline failed:", e)

# -------------------------
# Load data
# -------------------------

print("Loading datasets...")

with open(DATA_DIR / "correlations.json") as f:
    correlations = json.load(f)

with open(DATA_DIR / "drug_details.json") as f:
    drug_details = json.load(f)

with open(DATA_DIR / "genes_data.json") as f:
    genes_data = json.load(f)

with open(DATA_DIR / "drug_responses.json") as f:
    drug_responses = json.load(f)

with open(DATA_DIR / "liver_comparison_new.json") as f:
    liver_comparison = json.load(f)

print("Data loaded.")

# -------------------------
# Routes
# -------------------------

@app.get("/api/correlations")
def get_correlations():
    return correlations


@app.get("/api/drug-details")
def get_drug_details():
    return drug_details


@app.get("/api/genes-data")
def get_genes_data():
    return genes_data


@app.get("/api/drug-responses/{drug}")
def get_drug_responses(drug: str):

    if drug not in drug_responses:
        raise HTTPException(
            status_code=404,
            detail="Drug response data not found"
        )

    return drug_responses[drug]


@app.get("/api/liver-comparison")
def get_liver_comparison():
    return liver_comparison


@app.get("/api/status")
def status():

    return {
        "status": "online",
        "drugsCount": len(drug_responses),
        "significantHits": len(correlations)
    }