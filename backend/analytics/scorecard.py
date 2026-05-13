from rag.retriever import retrieve
from groq import Groq
from dotenv import load_dotenv
load_dotenv()

client = Groq()

COMPANIES = ["TCS", "Infosys", "Wipro", "HCLTech", "TechMahindra"]

def extract_number(company: str, metric_query: str, metric_name: str) -> str:
    chunks = retrieve(f"{metric_query} {company} FY25 FY2025", n_results=3, company=company)
    if not chunks:
        return "N/A"
    
    context = "\n".join([c["text"][:500] for c in chunks])
    
    prompt = f"""Extract only the {metric_name} for {company} for FY2025 from the context below.
Return ONLY the number with its unit (e.g. "6.0%", "19.2%", "0.05x"). 
If not found, return "N/A". No explanation, just the value.

Context:
{context}
"""
    
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}]
    )
    
    return response.choices[0].message.content.strip()

def generate_scorecard(company: str) -> dict:
    return {
        "company": company,
        "metrics": {
            "revenue_growth": extract_number(company, "revenue growth percentage", "revenue growth %"),
            "net_profit_margin": extract_number(company, "net profit margin percentage", "net profit margin %"),
            "roe": extract_number(company, "return on equity ROE", "ROE %"),
            "debt_to_equity": extract_number(company, "debt to equity ratio", "debt to equity ratio"),
        }
    }