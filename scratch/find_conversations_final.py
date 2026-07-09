import re

path = r"C:\Users\An\.gemini\antigravity\brain\4e3d43a7-a686-4a33-b0f2-615018405b9d\.system_generated\steps\3195\content.md"
out_path = r"C:\Users\An\Herd\skillmongo\scratch\chat_final_sentences.txt"

with open(path, "r", encoding="utf-8") as f:
    text = f.read()

# Let's search for sentences containing keywords in Indonesian
keywords = ["srs", "spesifikasi", "kebutuhan", "diagram", "dokumen", "sistem", "lengkap", "kurang", "detail", "analisis", "database", "rpg", "gemini", "evaluasi", "kritik", "masukan"]

# Let's use a regex to find any sequence of characters containing Indonesian words, separated by typical delimiters like quotes or braces.
# We can search for all text fragments that have at least 3 Indonesian words in them.
indonesian_words = ["yang", "dan", "untuk", "dengan", "adalah", "pada", "dari", "dalam", "bisa", "buat", "srs", "lengkap", "detail", "akurat"]

# Split the text by tags or json quotes
fragments = re.split(r'[<>"\{\}\[\]\n\r]', text)
clean_fragments = []
for f in fragments:
    f_clean = f.strip()
    if len(f_clean) > 30 and len(f_clean) < 3000:
        lower_f = f_clean.lower()
        # Count how many indonesian words match
        matches = sum(1 for w in indonesian_words if w in lower_f)
        if matches >= 2:
            clean_fragments.append(f_clean)

# Remove duplicates while preserving order
seen = set()
unique_fragments = []
for f in clean_fragments:
    f_norm = re.sub(r'\s+', ' ', f).strip()
    if f_norm not in seen:
        seen.add(f_norm)
        unique_fragments.append(f_norm)

with open(out_path, "w", encoding="utf-8") as out_f:
    out_f.write("\n\n---\n\n".join(unique_fragments))

print(f"Extracted {len(unique_fragments)} unique clean fragments.")
