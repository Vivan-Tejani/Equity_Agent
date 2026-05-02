import pandas as pd
from analytics.scorecard import generate_scorecard

COMPANIES = ["TCS", "Infosys", "Wipro", "HCL Tech", "Tech Mahindra"]

def generate_comparison(df: pd.DataFrame) -> list:
    results = []
    
    for company in COMPANIES:
        scorecard = generate_scorecard(df, company)
        if "error" not in scorecard:
            results.append({
                "company": company,
                "revenue_growth": scorecard["metrics"]["revenue_growth"],
                "net_profit_margin": scorecard["metrics"]["net_profit_margin"],
                "roe": scorecard["metrics"]["roe"],
                "debt_to_equity": scorecard["metrics"]["debt_to_equity"],
                "financial_score": scorecard["financial_score"]
            })
    
    return results