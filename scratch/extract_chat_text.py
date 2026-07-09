import re
import json

path = r"C:\Users\An\AppData\Local\Temp\content.html" # wait, the file path is:
path = r"C:\Users\An\.gemini\antigravity\brain\4e3d43a7-a686-4a33-b0f2-615018405b9d\.system_generated\steps\3195\content.md"

with open(path, "r", encoding="utf-8") as f:
    html = f.read()

# Let's search for "window.WIZ_global_data" or JSON structures in the page
# In shared gemini links, the conversation is often embedded in the HTML or inside a JSON string.
# Let's extract all text that looks like conversation content.
# We can search for the user's prompt or the assistant's response.
# Let's search for some Indonesian text or review feedback.

# Clean up HTML tags first to read raw text
text = re.sub(r'<[^>]+>', ' ', html)
# Replace multiple spaces/newlines
text = re.sub(r'\s+', ' ', text)

# Let's write the cleaned text to a file so we can view it
out_path = r"C:\Users\An\Herd\skillmongo\scratch\extracted_text.txt"
with open(out_path, "w", encoding="utf-8") as out_f:
    out_f.write(text[:50000]) # write first 50kb of clean text

print("Extracted first 50kb of clean text successfully.")
