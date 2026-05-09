from langchain_text_splitters import RecursiveCharacterTextSplitter


text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
    separators=["\n\n", "\n", ". ", " ", ""],
)


def chunk_documents(documents: list):
    """
    Splits parsed documents into smaller chunks
    while preserving metadata.
    """

    chunked_docs = []

    for doc in documents:

        text = doc["text"]
        metadata = doc["metadata"]

        chunks = text_splitter.split_text(text)

        for chunk in chunks:
            chunked_docs.append(
                {
                    "text": chunk,
                    "metadata": metadata,
                }
            )

    return chunked_docs