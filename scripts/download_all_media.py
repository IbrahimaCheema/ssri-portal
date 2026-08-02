import os
import urllib.request

images = [
    "https://ssri.pk/wp-content/uploads/2023/06/sr-logo.png",
    "https://ssri.pk/wp-content/uploads/2023/06/cane-logo.png",
    "https://ssri.pk/wp-content/uploads/2023/06/Banner_00.png",
    "https://ssri.pk/wp-content/uploads/2023/06/VAR-SLSG-1283-1024x1024.jpg",
    "https://ssri.pk/wp-content/uploads/2023/06/VAR-CP-1101-1024x1024.jpg",
    "https://ssri.pk/wp-content/uploads/2023/06/VAR-SLSG-483-1024x1024.jpg",
    "https://ssri.pk/wp-content/uploads/2023/06/VAR-SLSG-109-1024x1024.jpg",
    "https://ssri.pk/wp-content/uploads/2023/06/VAR-CPTJ-349-1024x1024.jpg",
    "https://ssri.pk/wp-content/uploads/2023/06/VAR-SLSG-1591-1024x1024.jpg",
    "https://ssri.pk/wp-content/uploads/2023/06/VAR-CPSG-2525-1024x1024.jpg",
    "https://ssri.pk/wp-content/uploads/2023/06/VAR-CPSG-29-1024x1024.jpg",
    "https://ssri.pk/wp-content/uploads/2023/06/VAR-CPSG-153-1024x1024.jpg",
    "https://ssri.pk/wp-content/uploads/2023/06/VAR-SLSG-128-1024x1024.jpg",
    "https://ssri.pk/wp-content/uploads/2023/06/crysopa-card-1024x1024.jpg",
    "https://ssri.pk/wp-content/uploads/2023/06/tissue-culture.png",
    "https://ssri.pk/wp-content/uploads/2023/06/T_1-1024x1024.jpg",
    "https://ssri.pk/wp-content/uploads/2023/06/G_1-1024x768.jpg",
    "https://ssri.pk/wp-content/uploads/2023/06/G_2-1024x768.jpg",
    "https://ssri.pk/wp-content/uploads/2023/06/G_4-1024x768.jpg",
    "https://ssri.pk/wp-content/uploads/2023/06/G_5-1024x768.jpg",
    "https://ssri.pk/wp-content/uploads/2023/06/G_3-1024x768.jpg",
    "https://ssri.pk/wp-content/uploads/2023/06/G_13-768x1024.jpg",
    "https://ssri.pk/wp-content/uploads/2023/06/G_8-1024x768.jpg",
    "https://ssri.pk/wp-content/uploads/2023/06/G_14-768x1024.jpg",
    "https://ssri.pk/wp-content/uploads/2023/06/G_10-768x1024.jpg",
    "https://ssri.pk/wp-content/uploads/2023/06/G_9-768x1024.jpg",
    "https://ssri.pk/wp-content/uploads/2023/06/G_11-768x1024.jpg",
    "https://ssri.pk/wp-content/uploads/2023/06/G_12-768x1024.jpg",
    "https://ssri.pk/wp-content/uploads/2023/06/G_6-1024x768.jpg",
    "https://ssri.pk/wp-content/uploads/2023/06/G_76-1024x768.jpg"
]

os.makedirs('public/images', exist_ok=True)
headers = {'User-Agent': 'Mozilla/5.0'}

for url in images:
    filename = url.split('/')[-1]
    filepath = os.path.join('public/images', filename)
    print(f"Downloading {url} -> {filepath}")
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as resp, open(filepath, 'wb') as f:
            f.write(resp.read())
        print(f"  OK: {filename}")
    except Exception as e:
        print(f"  ERROR downloading {url}: {e}")

print("Media download completed.")
