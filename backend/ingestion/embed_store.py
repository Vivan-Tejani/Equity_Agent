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

    vectorstore.persist()

    print(f"Stored {len(langchain_docs)} chunks in ChromaDB")

    return vectorstore