import chromadb
from sentence_transformers import SentenceTransformer
from chromadb.api.types import Where

model = SentenceTransformer("all-MiniLM-L6-v2")
client = chromadb.PersistentClient(path="./chroma_db")
collection = client.get_or_create_collection("equity_research")

def retrieve(query: str, n_results: int = 5, company: str | None = None):
    query_embedding = model.encode(query).tolist()
    
    where_filter: Where | None = {"company": {"$eq": company}} if company else None
    
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=n_results,
        where=where_filter
    )

    documents = results["documents"] or []
    metadatas = results["metadatas"] or []

    chunks = []
    for i in range(len(documents[0])):
        chunks.append({
            "text": documents[0][i],
            "metadata": metadatas[0][i]
        })
    
    return chunks