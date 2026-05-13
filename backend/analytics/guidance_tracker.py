from rag.retriever import retrieve

def track_guidance(company: str) -> list:
    
    promise_chunks = retrieve(
        query="management guidance target outlook forecast next quarter",
        n_results=10,
        company=company
    )
    
    delivery_chunks = retrieve(
        query="actual results achieved delivered performance this quarter",
        n_results=10,
        company=company
    )
    
    promises = []
    for chunk in promise_chunks:
        m = chunk["metadata"]
        promises.append({
            "type": "promise",
            "text": chunk["text"][:300],
            "company": m["company"],
            "doc_type": m["doc_type"],
            "year": m["year"],
            "page_number": m.get("page_number", "N/A")
        })

    deliveries = []
    for chunk in delivery_chunks:
        m = chunk["metadata"]
        deliveries.append({
            "type": "delivery",
            "text": chunk["text"][:300],
            "company": m["company"],
            "doc_type": m["doc_type"],
            "year": m["year"],
            "page_number": m["page_number"]
        })

    return promises + deliveries