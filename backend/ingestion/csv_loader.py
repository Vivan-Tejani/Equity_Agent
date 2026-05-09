import os
import pandas as pd


def parse_csv(file_path: str, company: str, doc_type: str, year: str):
    chunks = []

    df = pd.read_csv(file_path)

    for row_num, (_, row) in enumerate(df.iterrows(), start=1):
        # Build a stable, readable row representation for downstream embedding.
        row_text = " | ".join(f"{col}: {row[col]}" for col in df.columns)

        chunks.append({
            "text": row_text,
            "metadata": {
                "company": company,
                "doc_type": doc_type,
                "year": year,
                "row_number": row_num,
                "source": os.path.basename(file_path)
            }
        })

    return chunks
