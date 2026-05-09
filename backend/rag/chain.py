from groq import Groq
from rag.retriever import retrieve

client = Groq()

def answer_question(query: str, company: str | None = None):
    chunks = retrieve(query, n_results=5, company=company)
    
    if not chunks:
        return {
            "answer": "Cannot answer — no relevant information found in the corpus.",
            "sources": []
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
    
    return {
        "answer": response.choices[0].message.content,
        "sources": [chunk["metadata"] for chunk in chunks]
    }