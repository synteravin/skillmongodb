import re
import json

path = r"C:\Users\An\.gemini\antigravity\brain\4e3d43a7-a686-4a33-b0f2-615018405b9d\.system_generated\steps\3195\content.md"
out_path = r"C:\Users\An\Herd\skillmongo\scratch\chat_final_extracted.txt"

with open(path, "r", encoding="utf-8") as f:
    html = f.read()

# Let's search for JSON arrays or strings.
# WIZ global data can have very nested lists.
# Let's extract all string values from the HTML file.
strings = re.findall(r'"([^"\\]*(?:\\.[^"\\]*)*)"', html)

extracted = []
for s in strings:
    # Decode string escapes
    try:
        decoded = bytes(s, "utf-8").decode("unicode_escape")
    except Exception:
        decoded = s
    
    clean = decoded.strip()
    if len(clean) > 30:
        # Check if it has Indonesian words commonly used in the review
        if any(word in clean.lower() for word in ["srs", "spesifikasi", "kebutuhan", "diagram", "dokumen", "sistem", "lengkap", "kurang", "detail", "analisis", "database", "rpg"]):
            # Filter out pure HTML strings if they are too noisy, but keep raw text
            if "<script" not in clean and "window.WIZ" not in clean:
                extracted.append(clean)

# Also let's do a regex search for Indonesian sentences
indonesian_sentences = re.findall(r'[A-Z][a-zA-Z0-9\s,\.\?\!\-\(\)]{20,300}[\.\?\!]', html)
for s in indonesian_sentences:
    if any(word in s.lower() for word in ["srs", "spesifikasi", "kebutuhan", "diagram", "dokumen", "sistem", "lengkap", "kurang", "detail", "analisis", "database", "rpg"]):
        extracted.append(s)

# Remove duplicates while preserving order
seen = set()
unique_extracted = []
for item in extracted:
    item_clean = re.sub(r'\s+', ' ', item).strip()
    if item_clean not in seen and len(item_clean) > 30:
        seen.add(item_clean)
        unique_extracted.append(item_clean)

with open(out_path, "w", encoding="utf-8") as out_f:
    out_f.write("\n\n=== EXTRACTED BLOCK ===\n\n".join(unique_extracted))

print(f"Extracted {len(unique_extracted)} unique text blocks.")
