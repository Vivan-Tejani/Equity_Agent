from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from rag.chain import answer_question
from analytics.scorecard import generate_scorecard
from analytics.guidance_tracker import track_guidance
from analytics.comparison import generate_comparison
import pandas as pd

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class QuestionRequest(BaseModel):
    question: str
    company: str | None = None

@app.get("/")
def root():
    return {"status": "ok"}

@app.post("/ask")
def ask(request: QuestionRequest):
    result = answer_question(request.question, request.company)
    return result

@app.get("/scorecard/{company}")
def scorecard(company: str):
    return generate_scorecard(company)

@app.get("/guidance/{company}")
def guidance(company: str):
    return track_guidance(company)

@app.get("/comparison")
def comparison():
    return [generate_scorecard(company) for company in ["TCS", "Infosys", "Wipro", "HCLTech", "TechMahindra"]]