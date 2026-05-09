
import pandas as pd
from pathlib import Path


def load_csv(file_path: str, company: str) -> list[dict]:
    """
    Reads a Screener.in Excel export and returns a flat list of dicts.
    Each dict represents one (company, sheet, metric, year, value) record.
    """
    file_path = Path(file_path)
    if not file_path.exists():
        raise FileNotFoundError(f"File not found: {file_path}")

    xl = pd.ExcelFile(file_path)
    records = []

    for sheet_name in xl.sheet_names:
        df = xl.parse(sheet_name, index_col=0)

        # Screener exports: rows = metrics, columns = years
        df.dropna(how="all", inplace=True)
        df.dropna(axis=1, how="all", inplace=True)

        for metric in df.index:
            for year_col in df.columns:
                value = df.at[metric, year_col]

                if pd.isna(value):
                    continue

                records.append({
                    "company": company,
                    "sheet": sheet_name.strip(),
                    "metric": str(metric).strip(),
                    "year": str(year_col).strip(),
                    "value": value,
                    "source": file_path.name,
                })

    return records