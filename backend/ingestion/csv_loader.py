import pandas as pd
from pathlib import Path


def load_csv(file_path: str, company: str):
    """
    Loads Screener.in Excel export and converts it
    into standardized RAG-ready documents.
    """

    file_path = Path("")

    if not file_path.exists():
        raise FileNotFoundError(f"File not found: {file_path}")

    xl = pd.ExcelFile(file_path)

    documents = []

    for sheet_name in xl.sheet_names:

        df = xl.parse(sheet_name, index_col=0)

        # Remove empty rows and columns
        df.dropna(how="all", inplace=True)
        df.dropna(axis=1, how="all", inplace=True)

        # Rows = metrics
        # Columns = years
        for metric in df.index:
            for year_col in df.columns:

                value = df.at[metric, year_col]

                if pd.isna(value):
                    continue

                text = f"{metric} for {year_col} is {value}"

                documents.append(
                    {
                        "text": text,
                        "metadata": {
                            "company": company,
                            "doc_type": "financial_excel",
                            "sheet": sheet_name.strip(),
                            "metric": str(metric).strip(),
                            "year": str(year_col).strip(),
                            "value": str(value),
                            "source_file": file_path.name,
                        },
                    }
                )

    return documents
