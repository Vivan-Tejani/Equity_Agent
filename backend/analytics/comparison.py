from analytics.scorecard import generate_scorecard

COMPANIES = ["TCS", "Infosys", "Wipro", "HCLTech", "TechMahindra"]

def generate_comparison() -> list:
    results = []

    for company in COMPANIES:
        scorecard = generate_scorecard(company)
        metrics = scorecard.get("metrics", {})
        results.append({
            "company": company,
            "financial_score": scorecard.get("financial_score"),
            "revenue_growth": metrics.get("revenue_growth"),
            "net_profit_margin": metrics.get("net_profit_margin"),
            "roe": metrics.get("roe"),
            "debt_to_equity": metrics.get("debt_to_equity"),
        })

    return results