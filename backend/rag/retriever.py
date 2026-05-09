from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
CHROMA_PATH = "chroma_db"

embeddings = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)

def retrieve(query: str, n_results: int = 5, company: str | None = None):
    vectorstore = Chroma(
        persist_directory=CHROMA_PATH,
        embedding_function=embeddings
    )
    
    filter_dict = {"company": company} if company else None
    
    results = vectorstore.similarity_search(
        query,
        k=n_results,
        filter=filter_dict
    )
    
    chunks = []
    for r in results:
        chunks.append({
            "text": r.page_content,
            "metadata": r.metadata
        })
    
    return chunks