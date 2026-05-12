import re

from rag.retriever import retrieve

COMPANIES = ["TCS", "Infosys", "Wipro", "HCLTech", "TechMahindra"]

METRIC_QUERIES = {
    "revenue_growth": "revenue growth percentage",
    "net_profit_margin": "net profit margin percentage",
    "roe": "return on equity ROE",
    "debt_to_equity": "debt to equity ratio",
}

SCORE_RULES = {
    "revenue_growth":    {"green": 10,  "yellow": 5,   "reverse": False},
    "net_profit_margin": {"green": 20,  "yellow": 10,  "reverse": False},
    "roe":               {"green": 20,  "yellow": 10,  "reverse": False},
    "debt_to_equity":    {"green": 0.5, "yellow": 1.0, "reverse": True},
}

def _parse_float(value: str | None) -> float | None:
    if value is None:
        return None
    match = re.search(r"-?\d+(?:\.\d+)?", str(value))
    if not match:
        return None
    return float(match.group(0))

def _get_metric_value(company: str, metric_key: str) -> float | None:
    query = f"{METRIC_QUERIES[metric_key]} {company} FY25 FY2025"
    chunks = retrieve(query, n_results=5, company=company)
    if not chunks:
        return None

    # Prefer structured metadata from Screener Excel ingestion.
    for chunk in chunks:
        value = _parse_float(chunk.get("metadata", {}).get("value"))
        if value is not None:
            return value

    # Fall back to the first chunk text if metadata is missing.
    return _parse_float(chunks[0].get("text"))

def _score_metric(metric_key: str, value: float | None) -> int | None:
    if value is None:
        return None
    rule = SCORE_RULES[metric_key]
    if rule["reverse"]:
        if value <= rule["green"]:
            return 100
        if value <= rule["yellow"]:
            return 60
        return 30
    if value >= rule["green"]:
        return 100
    if value >= rule["yellow"]:
        return 60
    return 30

def _compute_financial_score(metrics: dict) -> int | None:
    scores = []
    for key, value in metrics.items():
        metric_score = _score_metric(key, value)
        if metric_score is not None:
            scores.append(metric_score)
    if not scores:
        return None
    return round(sum(scores) / len(scores))

def generate_scorecard(company: str) -> dict:
    metrics = {key: _get_metric_value(company, key) for key in METRIC_QUERIES.keys()}
    financial_score = _compute_financial_score(metrics)

    return {
        "company": company,
        "metrics": metrics,
        "financial_score": financial_score,
    }