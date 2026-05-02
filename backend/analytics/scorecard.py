import pandas as pd

def generate_scorecard(df: pd.DataFrame, company: str) -> dict:
    company_df = df[df["company"] == company]
    
    if company_df.empty:
        return {"error": f"No data found for {company}"}
    
    def get_metric(metric_name: str):
        row = company_df[company_df["metric"] == metric_name]
        return float(row["value"].iloc[0]) if not row.empty else None

    revenue_growth = get_metric("Revenue Growth %")
    net_profit_margin = get_metric("Net Profit Margin %")
    roe = get_metric("ROE %")
    debt_to_equity = get_metric("Debt to Equity")

    financial_score = 0
    if revenue_growth and revenue_growth > 10: financial_score += 25
    if net_profit_margin and net_profit_margin > 15: financial_score += 25
    if roe and roe > 20: financial_score += 25
    if debt_to_equity and debt_to_equity < 0.5: financial_score += 25

    return {
        "company": company,
        "metrics": {
            "revenue_growth": revenue_growth,
            "net_profit_margin": net_profit_margin,
            "roe": roe,
            "debt_to_equity": debt_to_equity
        },
        "financial_score": financial_score
    }