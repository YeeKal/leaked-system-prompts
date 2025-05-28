import os
import re
from datetime import datetime

FONTMATTER_PATH = 'fontmatter.txt'
PROMPTS_DIR = 'prompts'

def parse_fontmatter_txt(path):
    entries = []
    with open(path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    entry = {}
    for line in lines:
        line = line.strip()
        if not line:
            if entry:
                entries.append(entry)
                entry = {}
            continue
        if line.startswith('file:'):
            entry['file'] = line.split(':', 1)[1].strip()
        elif line.startswith('company:'):
            entry['company'] = line.split(':', 1)[1].strip()
        elif line.startswith('model:'):
            entry['model'] = line.split(':', 1)[1].strip()
        elif line.startswith('date:'):
            entry['date'] = line.split(':', 1)[1].strip()
    if entry:
        entries.append(entry)
    return entries

def make_frontmatter(entry):
    company = entry.get('company', '')
    model = entry.get('model', '')
    date = entry.get('date', '')
    # Title
    title = f"{model} System Prompt"
    # Description
    if date and date != 'N/A' and len(date) == 8:
        date_obj = datetime.strptime(date, '%Y%m%d')
        date_str = date_obj.strftime('%B %d, %Y')
        date_short = date_obj.strftime('%Y-%m-%d')
        description = f"The leaked {model} system prompt at {date_str}."
        seo_title = f"{model} System Prompt leaked at ({date_short})"
        seo_description = f"View {model} system prompt leaked on {date_short}."
    else:
        description = f"The leaked {model} system prompt."
        seo_title = f"{model} System Prompt leaked"
        seo_description = f"View {model} system prompt leaked."
    frontmatter = (
        f"---\n"
        f"company: {company}\n"
        f"model: {model}\n"
        f"date: {date_short}\n"
        f"title: {title}\n"
        f"description: {description}\n"
        f"seo_title: {seo_title}\n"
        f"seo_description: {seo_description}\n"
        f"---\n"
    )
    return frontmatter

def insert_frontmatter(md_path, frontmatter):
    with open(md_path, 'r', encoding='utf-8') as f:
        content = f.read()
    if content.lstrip().startswith('---'):
        print(f"[SKIP] {md_path} already has frontmatter.")
        return
    with open(md_path, 'w', encoding='utf-8') as f:
        f.write(frontmatter + '\n' + content)
    print(f"[OK] Added frontmatter to {md_path}")

def main():
    entries = parse_fontmatter_txt(FONTMATTER_PATH)
    for entry in entries:
        filename = entry.get('file')
        if not filename:
            continue
        # Find the file in prompts/ (recursively)
        for root, dirs, files in os.walk(PROMPTS_DIR):
            if filename in files:
                md_path = os.path.join(root, filename)
                frontmatter = make_frontmatter(entry)
                insert_frontmatter(md_path, frontmatter)
                break
        else:
            print(f"[WARN] File not found: {filename}")

if __name__ == '__main__':
    main() 