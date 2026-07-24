#!/usr/bin/env python3
import os
import re
import math
import argparse
import json
import time

try:
    import requests
    USE_REQUESTS = True
except ImportError:
    import urllib.request
    import urllib.error
    USE_REQUESTS = False

def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')

def extract_title(content: str, filename: str) -> str:
    for line in content.splitlines():
        line = line.strip()
        if line.startswith('# '):
            return line.lstrip('# ').strip()
    
    base = os.path.splitext(filename)[0]
    clean = base.replace('_', ' ').replace('-', ' ')
    return clean.title()

def extract_summary(content: str, max_chars: int = 250) -> str:
    clean_lines = []
    in_code_block = False
    
    for line in content.splitlines():
        stripped = line.strip()
        if stripped.startswith('```'):
            in_code_block = not in_code_block
            continue
        if in_code_block or stripped.startswith('#') or not stripped:
            continue
        clean_lines.append(stripped)
    
    full_text = " ".join(clean_lines)
    if not full_text:
        return "System documentation article."
        
    if len(full_text) > max_chars:
        return full_text[:max_chars].rsplit(' ', 1)[0] + "..."
    return full_text

def calculate_read_time(content: str) -> str:
    words = len(re.findall(r'\w+', content))
    minutes = max(1, math.ceil(words / 200))
    return f"{minutes} min read"

def extract_tags(rel_path: str) -> list[str]:
    parts = rel_path.split(os.sep)
    tags = []
    for p in parts[:-1]:
        clean = p.replace('_', '-').lower()
        if clean and clean not in tags:
            tags.append(clean)
    
    filename = os.path.splitext(parts[-1])[0]
    for key in ["api", "sdk", "realtime", "auth", "policy", "vector", "graphql", "scripting"]:
        if key in filename.lower() and key not in tags:
            tags.append(key)
            
    if not tags:
        tags.append("documentation")
    return tags

def post_with_retry(target_url, payload, api_key, proxy=None, max_retries=5, base_delay=1.0):
    headers = {
        "Content-Type": "application/json",
        "x-api-key": api_key,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    }

    proxies = {"http": proxy, "https": proxy} if proxy else None

    for attempt in range(1, max_retries + 1):
        try:
            if USE_REQUESTS:
                res = requests.post(target_url, json=payload, headers=headers, proxies=proxies, timeout=25)
                if res.status_code in (200, 201):
                    return True, "201 Created"
                elif res.status_code == 429:
                    wait_time = base_delay * (2 ** attempt)
                    print(f"    ⏳ Rate Limited (429). Retrying in {wait_time:.1f}s (Attempt {attempt}/{max_retries})...")
                    time.sleep(wait_time)
                else:
                    return False, f"HTTP {res.status_code}: {res.text[:120]}"
            else:
                json_data = json.dumps(payload).encode('utf-8')
                req = urllib.request.Request(target_url, data=json_data, headers=headers, method="POST")
                
                if proxy:
                    proxy_handler = urllib.request.ProxyHandler({'http': proxy, 'https': proxy})
                    opener = urllib.request.build_opener(proxy_handler)
                    response = opener.open(req, timeout=25)
                else:
                    response = urllib.request.urlopen(req, timeout=25)

                if response.status in (200, 201):
                    return True, "201 Created"

        except Exception as e:
            err_str = str(e)
            if "429" in err_str:
                wait_time = base_delay * (2 ** attempt)
                print(f"    ⏳ Rate limited (429). Retrying in {wait_time:.1f}s (Attempt {attempt}/{max_retries})...")
                time.sleep(wait_time)
            else:
                if attempt == max_retries:
                    return False, f"Error: {err_str}"
                time.sleep(base_delay)

    return False, "Failed after maximum retries"

def seed_documentation(docs_dir: str, base_url: str, tenant: str, api_key: str, delay: float, proxy: str = None):
    target_url = f"{base_url.rstrip('/')}/tenant/{tenant}/api/v1/collections/articles/records"
    
    print(f"🚀 Starting documentation seeding process...")
    print(f"📂 Docs Directory: {docs_dir}")
    print(f"🏢 Tenant: {tenant}")
    print(f"🌐 Target Endpoint: {target_url}")
    if proxy:
        print(f"🛡️ Using Proxy: {proxy}")
    print(f"⏱️ Inter-request Delay: {delay}s\n")
    
    success_count = 0
    failure_count = 0

    for root, _, files in os.walk(docs_dir):
        for file in files:
            if not file.endswith('.md'):
                continue

            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, docs_dir)

            try:
                with open(full_path, 'r', encoding='utf-8') as f:
                    raw_content = f.read()

                if not raw_content.strip():
                    continue

                title = extract_title(raw_content, file)
                slug = slugify(title)
                summary = extract_summary(raw_content)
                read_time = calculate_read_time(raw_content)
                tags = extract_tags(rel_path)

                payload = {
                    "data": {
                        "title": title,
                        "slug": slug,
                        "summary": summary,
                        "content": raw_content,
                        "readTime": read_time,
                        "tags": tags
                    }
                }

                ok, msg = post_with_retry(target_url, payload, api_key, proxy=proxy)
                if ok:
                    print(f"  ✅ {rel_path} -> '{title}' ({slug})")
                    success_count += 1
                else:
                    print(f"  ❌ {rel_path}: {msg}")
                    failure_count += 1

                time.sleep(delay)

            except Exception as e:
                print(f"  ❌ [Error] {rel_path}: {e}")
                failure_count += 1

    print("\n==========================================")
    print(f"🎉 Seeding Complete! Total: {success_count} success, {failure_count} failed.")
    print("==========================================")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Seed Markdown documentation into ApexKit articles collection.")
    parser.add_argument("--dir", default="apex-kit/docs", help="Path to docs directory")
    parser.add_argument("--url", default="http://127.0.0.1:5000", help="ApexKit Base URL")
    parser.add_argument("--tenant", default="portfolio", help="Tenant ID")
    parser.add_argument("--key", required=True, help="API Key (x-api-key)")
    parser.add_argument("--delay", type=float, default=1.0, help="Delay between requests in seconds")
    parser.add_argument("--proxy", default=None, help="Optional proxy URL (e.g. socks5://109.68.215.84:1080)")

    args = parser.parse_args()
    seed_documentation(args.dir, args.url, args.tenant, args.key, args.delay, args.proxy)


# # 1. Create Python Virtual Environment
# python3 -m venv venv

# # 2. Activate the Virtual Environment
# source venv/bin/activate

# # 3. Install requirements
# pip install -r requirements.txt

# # 4. Run the documentation seeder script
# python3 seed_docs.py --dir apex-kit/docs --url http://127.0.0.1:5000 --key YOUR_API_KEY_HERE
# # RUN THE SCRIPT
# python3 next-apexkit-portfolio/apex_assets/seed_my_docs.py \
#   --dir apex-kit/docs \
#   --url http://127.0.0.1:5000 \
#   --tenant portfolio \
#   --key tnt_portfolio_sk_prod_d3d9061957ba677a4937a067c28c662c048060e044b3c7f87b73fc25a3e94_674c \
#   --delay 1.0