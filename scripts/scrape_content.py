import urllib.request
import re
import json
import os
from bs4 import BeautifulSoup

urls = [
    "https://ssri.pk/",
    "https://ssri.pk/index.php/about/",
    "https://ssri.pk/index.php/bog/",
    "https://ssri.pk/index.php/achievements/",
    "https://ssri.pk/index.php/services/",
    "https://ssri.pk/index.php/soil-and-water-advisory-service/",
    "https://ssri.pk/index.php/biological-control-laboratories/",
    "https://ssri.pk/index.php/tricho-card/",
    "https://ssri.pk/index.php/chrysopa-sheets/",
    "https://ssri.pk/index.php/tissueculture/",
    "https://ssri.pk/index.php/other-services/",
    "https://ssri.pk/index.php/psj/",
    "https://ssri.pk/index.php/gallery/",
    "https://ssri.pk/index.php/contact/"
]

data = {}

headers = {'User-Agent': 'Mozilla/5.0'}

os.makedirs('temp_scraped', exist_ok=True)

for url in urls:
    print(f"Scraping: {url}")
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as response:
            html = response.read().decode('utf-8')
            soup = BeautifulSoup(html, 'html.parser')
            
            title = soup.title.string if soup.title else url
            content_div = soup.find('div', class_='entry-content') or soup.find('div', id='content') or soup.body
            
            text_content = content_div.get_text(separator='\n', strip=True) if content_div else ""
            
            images = []
            if content_div:
                for img in content_div.find_all('img'):
                    src = img.get('src')
                    if src and not src.endswith('1x1.png'):
                        images.append(src)
            
            slug = url.replace('https://ssri.pk/', '').replace('index.php/', '').strip('/') or 'home'
            slug = re.sub(r'[^a-zA-Z0-9_-]', '_', slug)
            
            page_data = {
                'url': url,
                'title': title,
                'text': text_content,
                'images': images
            }
            
            data[slug] = page_data
            
            with open(f'temp_scraped/{slug}.json', 'w', encoding='utf-8') as f:
                json.dump(page_data, f, indent=2, ensure_ascii=False)
                
    except Exception as e:
        print(f"Error scraping {url}: {e}")

with open('temp_scraped/all_pages.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("Scraping completed!")
