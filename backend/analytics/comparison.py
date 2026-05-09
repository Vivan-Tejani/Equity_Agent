from analytics.scorecard import generate_scorecard

COMPANIES = ["TCS", "Infosys", "Wipro", "HCLTech", "TechMahindra"]

def generate_comparison() -> list:
    results = []
    
    for company in COMPANIES:
        scorecard = generate_scorecard(company)
        results.append(scorecard)
    
    return results