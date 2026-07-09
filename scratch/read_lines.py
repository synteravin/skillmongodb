path = r"C:\Users\An\.gemini\antigravity\brain\4e3d43a7-a686-4a33-b0f2-615018405b9d\.system_generated\steps\3195\content.md"

with open(path, "r", encoding="utf-8") as f:
    text = f.read()

print("Total length:", len(text))

# Find occurrences of 'srs' case insensitive
import re
matches = [m.start() for m in re.finditer(r'srs', text, re.IGNORECASE)]
print("Number of SRS matches:", len(matches))

# Let's print the 500 characters around the first 5 matches
for idx, pos in enumerate(matches[:10]):
    start = max(0, pos - 200)
    end = min(len(text), pos + 300)
    print(f"\nMatch {idx} at position {pos}:")
    print(text[start:end])
    print("-" * 50)
