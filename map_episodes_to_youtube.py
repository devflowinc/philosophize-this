import re
import json

# Function to extract episode number
def extract_episode_number(title):
    match = re.search(r'Episode\s*#?(\d+)', title, re.IGNORECASE)
    if match:
        return int(match.group(1))
    return None

# Read the text file
with open('podcast_links_and_titles.txt', 'r', encoding='utf-8') as file:
    lines = file.readlines()

# Process each line
result = []
for line in lines:
    parts = line.strip().split(' ', 1)
    if len(parts) == 2:
        link, title = parts
        episode_number = extract_episode_number(title)
        if episode_number is not None:
            result.append({
                "link": link,
                "episode_number": episode_number
            })

# Sort the result by episode number
result.sort(key=lambda x: x['episode_number'])

# Write to JSON file
with open('podcast_episodes_mapped_to_youtube.json', 'w', encoding='utf-8') as json_file:
    json.dump(result, json_file, indent=2)

print("Conversion completed. Check 'podcast_episodes_mapped_to_youtube.json'.")

