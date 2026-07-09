import re
import json

path = r"C:\Users\An\.gemini\antigravity\brain\4e3d43a7-a686-4a33-b0f2-615018405b9d\.system_generated\steps\3195\content.md"
out_path = r"C:\Users\An\Herd\skillmongo\scratch\chat_extracted.txt"

with open(path, "r", encoding="utf-8") as f:
    html = f.read()

output = []

# Search for the WIZ data
wiz_match = re.search(r"window\.WIZ_global_data\s*=\s*(\{.*?\});", html)
if wiz_match:
    try:
        data = json.loads(wiz_match.group(1))
        output.append("Found WIZ global data keys:")
        for k in data.keys():
            val_str = str(data[k])
            if len(val_str) > 100:
                output.append(f"- {k}: {val_str[:300]}...")
    except Exception as e:
        output.append(f"Error parsing JSON: {str(e)}")

# Extract using specific regex patterns for the shared gemini chat structure
# Shared gemini links contain arrays with chat questions and answers.
# Let's search for sequences of Indonesian text and paragraphs that look like the conversation.
# We can search for the user's prompt or the assistant's response.
# Gemini chat text is often contained in double quotes or escaped JSON arrays.

# Let's extract any text paragraph that contains Indonesian words related to SRS
matches = re.findall(r'"([^"]{50,2000})"', html)
output.append("\n--- Extracted Text Matches ---")
count = 0
for m in matches:
    clean_m = m.replace('\\n', '\n').replace('\\t', '\t').strip()
    if any(word in clean_m.lower() for word in ["srs", "spesifikasi", "kebutuhan", "diagram", "dokumen", "sistem", "lengkap"]):
        output.append(f"[{count}] {clean_m}")
        count += 1

with open(out_path, "w", encoding="utf-8") as out_f:
    out_f.write("\n".join(output))

print("Saved output to scratch/chat_extracted.txt successfully.")
