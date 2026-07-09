import re

path = r"C:\Users\An\.gemini\antigravity\brain\4e3d43a7-a686-4a33-b0f2-615018405b9d\.system_generated\steps\3195\content.md"
out_path = r"C:\Users\An\Herd\skillmongo\scratch\chat_final_clean.txt"

with open(path, "r", encoding="utf-8") as f:
    html = f.read()

# Let's search for all JSON strings in the file.
# Strings in JSON can have escaped characters.
# A regex to capture anything inside double quotes:
strings = re.findall(r'"((?:[^"\\]|\\.)*)"', html)

decoded_strings = []
for s in strings:
    try:
        # Decode escape sequences like \u201d, \n, etc.
        decoded = bytes(s, "utf-8").decode("unicode_escape")
        decoded_strings.append(decoded)
    except Exception:
        decoded_strings.append(s)

# Now let's filter for strings that look like actual Indonesian sentences in a chat conversation.
conversation = []
for s in decoded_strings:
    clean = s.strip()
    if len(clean) > 40:
        # Avoid HTML code blocks or JS libraries
        if "<script" in clean or "function(" in clean or "var " in clean or "css" in clean:
            continue
        
        # Check if it has Indonesian vocabulary indicating a review or prompt
        lower_clean = clean.lower()
        keywords = ["srs", "spesifikasi", "kebutuhan", "diagram", "dokumen", "sistem", "lengkap", "kurang", "detail", "analisis", "database", "rpg", "gemini", "evaluasi", "kritik", "masukan"]
        if any(w in lower_clean for w in keywords):
            conversation.append(clean)

# Remove duplicates while maintaining order
seen = set()
unique_convo = []
for c in conversation:
    c_clean = re.sub(r'\s+', ' ', c).strip()
    if c_clean not in seen:
        seen.add(c_clean)
        unique_convo.append(c_clean)

with open(out_path, "w", encoding="utf-8") as out_f:
    out_f.write("\n\n=== CHAT BLOCK ===\n\n".join(unique_convo))

print(f"Extracted {len(unique_convo)} unique chat blocks.")
