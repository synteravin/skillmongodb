import re
import json

path = r"C:\Users\An\.gemini\antigravity\brain\4e3d43a7-a686-4a33-b0f2-615018405b9d\.system_generated\steps\3195\content.md"
out_path = r"C:\Users\An\Herd\skillmongo\scratch\wiz_dump.txt"

with open(path, "r", encoding="utf-8") as f:
    html = f.read()

# Let's search for "window.WIZ_global_data"
wiz_match = re.search(r"window\.WIZ_global_data\s*=\s*(\{.*?\});", html)
if not wiz_match:
    print("Could not find WIZ data.")
    exit(0)

wiz_text = wiz_match.group(1)

# Let's extract all strings from this WIZ text
# We can use regex to find anything inside quotes
strings = re.findall(r'"([^"\\]*(?:\\.[^"\\]*)*)"', wiz_text)

extracted = []
for s in strings:
    # Clean it up
    try:
        clean = bytes(s, "utf-8").decode("unicode_escape").strip()
    except Exception:
        clean = s.strip()
    
    # We want text containing common Indonesian words or specific feedback
    if len(clean) > 30 and any(w in clean.lower() for w in ["srs", "spesifikasi", "kebutuhan", "diagram", "dokumen", "sistem", "lengkap", "kurang", "detail", "analisis", "database", "rpg"]):
        extracted.append(clean)

with open(out_path, "w", encoding="utf-8") as out_f:
    out_f.write("\n\n---\n\n".join(extracted))

print(f"Dumped {len(extracted)} strings to wiz_dump.txt")
