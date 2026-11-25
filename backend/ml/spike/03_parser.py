"""
    Spike 03 : Parsing the extracted by the OCR into structured fields using Regex
"""

import re

# Synthetic/Siumlated ouput

raw_ocr_lines = [
    "SUNRISE",
    "GLUCOSE BISCUIT",
    "MRP * Rs.28",
    "NET WT. 100g",
    "Batch No. GB-118",
    "BEST BEFORE DEC 2026"
]

def extract_fields(texts):
    fields = {}
    for text in texts:

        # MRP
        mrp_match = re.search(r'(?:MRP|Rs\.?)\s*[\*₹]?\s*(\d+\.?\d*)', text, re.IGNORECASE)
        if mrp_match:
            fields["mrp"] ={"value" : mrp_match.group(1), "raw":text}

        # weight
        net_match = re.search(r'(\d+\.?\d*)\s*(g|kg|ml|l|gm)', text, re.IGNORECASE)
        if net_match and "WT" in text.upper():
            fields["net_quantity"] = {"value" : f"{net_match.group(1)}{net_match.group(2).lower()}", "raw":text}

        # Date    
        date_match = re.search(r'(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\s*\d{4}', text, re.IGNORECASE)
        if date_match:
            fields["date"] = {"value" : date_match.group(0), "raw" : text}

    return fields


if __name__ == "__main__":
    extracted = extract_fields(raw_ocr_lines)
    print(f"\n{extracted}\n ")
    print("--- Structured Extraction Results --- \n")
    for key, data in extracted.items():
        print(f"{key.upper()} : {data['value']} (Found in : '{data['raw']}')")
    print("\n")