from langchain_community.vectorstores import Chroma
from langchain_core.documents import Document
from langchain_huggingface import HuggingFaceEmbeddings

EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
CHROMA_PATH = "chroma_db"

embeddings = HuggingFaceEmbeddings(
    model_name=EMBEDDING_MODEL
)

def store_embeddings(documents: list):
    langchain_docs = []
    for doc in documents:
        langchain_docs.append(
            Document(
                page_content=doc["text"],
                metadata=doc["metadata"],
            )
        )
    
    vectorstore = Chroma.from_documents(
        documents=langchain_docs,
        embedding=embeddings,
        persist_directory=CHROMA_PATH,
    )
    
    print(f"Stored {len(langchain_docs)} chunks in ChromaDB")
    return vectorstore

def query_embeddings(query_text: str, n_results: int = 5, company: str = None):
    vectorstore = Chroma(
        persist_directory=CHROMA_PATH,
        embedding_function=embeddings
    )
    
    filter_dict = {"company": company} if company else None
    
    results = vectorstore.similarity_search(
        query_text,
        k=n_results,
        filter=filter_dict
    )
    
    return [{"text": r.page_content, "metadata": r.metadata} for r in results]