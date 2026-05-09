import os
from dotenv import load_dotenv
load_dotenv()

from ingestion.pdf_parser import parse_pdf
from ingestion.csv_loader import load_csv
from embeddings.chunker import chunk_documents
from embeddings.embed_store import store_embeddings

# LOCAL FILE PATH — update this to your data folder
DATA_PATH = "/Users/vivan/Downloads/Data/raw"

COMPANIES = ["TCS", "Infosys", "Wipro", "HCLTech", "TechMahindra"]

DOC_TYPES = {
    "annual_fy24.pdf": ("annual_report", "2024"),
    "annual_fy25.pdf": ("annual_report", "2025"),
    "q1_fy25.pdf": ("quarterly_report", "2025"),
    "q2_fy25.pdf": ("quarterly_report", "2025"),
    "q3_fy25.pdf": ("quarterly_report", "2025"),
    "q4_fy25.pdf": ("quarterly_report", "2025"),
}

all_chunks = []

for company in COMPANIES:
    company_path = os.path.join(DATA_PATH, company)
    
    # Parse PDFs
    for filename, (doc_type, year) in DOC_TYPES.items():
        file_path = os.path.join(company_path, filename)
        if os.path.exists(file_path):
            print(f"Parsing {company} - {filename}")
            chunks = parse_pdf(file_path, company, doc_type, year)
            all_chunks.extend(chunks)
        else:
            print(f"MISSING: {company} - {filename}")
    
    # Parse earnings calls
    for filename in os.listdir(company_path):
        if filename.startswith("earnings") and filename.endswith(".pdf"):
            file_path = os.path.join(company_path, filename)
            print(f"Parsing {company} - {filename}")
            chunks = parse_pdf(file_path, company, "earnings_call", "2024-25")
            all_chunks.extend(chunks)
    
    # Parse Excel
    excel_path = os.path.join(company_path, "screener.xlsx")
    if os.path.exists(excel_path):
        print(f"Loading Excel - {company}")
        excel_chunks = load_csv(excel_path, company)
        all_chunks.extend(excel_chunks)

print(f"\nTotal chunks before chunking: {len(all_chunks)}")
chunked = chunk_documents(all_chunks)
print(f"Total chunks after chunking: {len(chunked)}")

store_embeddings(chunked)
print("Done! All data stored in ChromaDB.")