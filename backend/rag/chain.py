from groq import Groq
from rag.retriever import retrieve

client = Groq()

def get_confidence(avg_score: float) -> str:
    if avg_score >= 0.75:
        return "high"
    elif avg_score >= 0.5:
        return "medium"
    else:
        return "low"

def get_contributions(chunks: list) -> dict:
    contributions = {}
    for chunk in chunks:
        key = f"{chunk['metadata']['company']} | {chunk['metadata']['doc_type']}"
        contributions[key] = contributions.get(key, 0) + 1
    return contributions

def answer_question(query: str, company: str | None = None):
    chunks = retrieve(query, n_results=5, company=company)
    
    if not chunks:
        return {
            "answer": "Cannot answer — no relevant information found in the corpus.",
            "sources": [],
            "explainability": None
        }
    
    context = ""
    for chunk in chunks:
        m = chunk["metadata"]
        context += f"\n[{m['company']} | {m['doc_type']} | {m['year']} | Page {m['page_number']}]\n{chunk['text']}\n"
    
    prompt = f"""You are an equity research analyst. Answer the question using ONLY the context below.
If the answer is not in the context, say "Cannot answer from available documents."
Always cite your source as: Company | Document Type | Year | Page Number.

Context:
{context}

Question: {query}
"""
    
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}]
    )

    avg_score = sum(c["score"] for c in chunks) / len(chunks)
    top_chunks = sorted(chunks, key=lambda x: x["score"], reverse=True)[:3]

    return {
        "answer": response.choices[0].message.content,
        "sources": [chunk["metadata"] for chunk in chunks],
        "explainability": {
            "confidence": get_confidence(avg_score),
            "avg_score": round(avg_score, 4),
            "top_chunks": [
                {
                    "text": c["text"][:300],
                    "metadata": c["metadata"],
                    "score": c["score"]
                }
                for c in top_chunks
            ],
            "contributions": get_contributions(chunks)
        }
    }