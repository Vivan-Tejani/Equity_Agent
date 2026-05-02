import pdfplumber
import os

def parse_pdf(file_path: str, company: str, doc_type: str, year: str):
    chunks = []
    
    with pdfplumber.open(file_path) as pdf:
        for page_num, page in enumerate(pdf.pages, start=1):
            text = page.extract_text()
            if text and text.strip():
                chunks.append({
                    "text": text.strip(),
                    "metadata": {
                        "company": company,
                        "doc_type": doc_type,
                        "year": year,
                        "page_number": page_num,
                        "source": os.path.basename(file_path)
                    }
                })
    
    return chunks