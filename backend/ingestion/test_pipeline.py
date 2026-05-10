from dotenv import load_dotenv
load_dotenv()

from ingestion.pdf_parser import parse_pdf
from rag.chain import answer_question

chunks = parse_pdf(
    file_path="/Users/krish.sawant/python-projects/Data/raw/TCS/annual_fy25.pdf",
    company="TCS",
    doc_type="annual_report",
    year="2025"
)

print(f"PDF Parser: {len(chunks)} chunks extracted")
print(f"Sample chunk: {chunks[0]}")

# TEST 2: Q&A (will only work after friend's embed_store is done)
# result = answer_question("What is TCS revenue growth?", company="TCS")
# print(result)