from rag.retriever import retrieve

COMPANIES = ["TCS", "Infosys", "Wipro", "HCLTech", "TechMahindra"]

def get_metric_from_rag(company: str, metric: str) -> str | None:
    chunks = retrieve(f"{metric} {company} FY25 FY2025", n_results=3, company=company)
    if chunks:
        return chunks[0]["text"][:300]
    return None

def generate_scorecard(company: str) -> dict:
    metrics = {
        "revenue_growth": get_metric_from_rag(company, "revenue growth percentage"),
        "net_profit_margin": get_metric_from_rag(company, "net profit margin percentage"),
        "roe": get_metric_from_rag(company, "return on equity ROE"),
        "debt_to_equity": get_metric_from_rag(company, "debt to equity ratio"),
    }
    
    return {
        "company": company,
        "metrics": metrics,
    }