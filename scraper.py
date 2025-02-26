import os
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse

# Base URL of the website to scrape
BASE_URL = "https://thorswap.finance"  # Update if needed

# Directory where all scraped content will be saved
CONTENT_DIR = "thorswap_content"

def create_directory(path):
    """Create directory if it does not exist."""
    if not os.path.exists(path):
        os.makedirs(path)

def save_content(url, folder, filename):
    """Download and save content from a URL into the specified folder with given filename."""
    try:
        response = requests.get(url)
        response.raise_for_status()
        file_path = os.path.join(folder, filename)
        with open(file_path, "wb") as f:
            f.write(response.content)
        print(f"Downloaded: {url} -> {file_path}")
    except Exception as e:
        print(f"Error downloading {url}: {e}")

def update_asset_paths():
    """Rewrite asset paths in the downloaded index.html to point to local files."""
    index_path = os.path.join(CONTENT_DIR, "index.html")
    with open(index_path, "r", encoding="utf-8") as f:
        soup = BeautifulSoup(f, "html.parser")
    
    # Update CSS links: change href to point to local css/ folder
    for link in soup.find_all("link", rel="stylesheet"):
        href = link.get("href")
        if href:
            # Extract filename from the absolute URL
            filename = os.path.basename(urlparse(urljoin(BASE_URL, href)).path)
            # Change href to local relative path
            link["href"] = os.path.join("css", filename)
    
    # Update script tags: change src to point to local js/ folder
    for script in soup.find_all("script"):
        src = script.get("src")
        if src:
            filename = os.path.basename(urlparse(urljoin(BASE_URL, src)).path)
            script["src"] = os.path.join("js", filename)
    
    # Update image tags: change src to point to local images/ folder
    for img in soup.find_all("img"):
        src = img.get("src")
        if src:
            filename = os.path.basename(urlparse(urljoin(BASE_URL, src)).path)
            img["src"] = os.path.join("images", filename)
    
    with open(index_path, "w", encoding="utf-8") as f:
        f.write(str(soup))
    print("Updated asset paths in index.html")

def scrape_website():
    # Create the main content directory
    create_directory(CONTENT_DIR)
    
    # Download the main HTML page
    try:
        response = requests.get(BASE_URL)
        response.raise_for_status()
    except Exception as e:
        print(f"Error retrieving main page: {e}")
        return

    html_content = response.text
    main_html_path = os.path.join(CONTENT_DIR, "index.html")
    with open(main_html_path, "w", encoding="utf-8") as f:
        f.write(html_content)
    print(f"Saved main page to {main_html_path}")
    
    # Parse the HTML
    soup = BeautifulSoup(html_content, "html.parser")
    
    # Download CSS files
    css_folder = os.path.join(CONTENT_DIR, "css")
    create_directory(css_folder)
    for link in soup.find_all("link", rel="stylesheet"):
        href = link.get("href")
        if href:
            css_url = urljoin(BASE_URL, href)
            parsed = urlparse(css_url)
            css_filename = os.path.basename(parsed.path) or "style.css"
            save_content(css_url, css_folder, css_filename)
    
    # Download JavaScript files
    js_folder = os.path.join(CONTENT_DIR, "js")
    create_directory(js_folder)
    for script in soup.find_all("script"):
        src = script.get("src")
        if src:
            js_url = urljoin(BASE_URL, src)
            parsed = urlparse(js_url)
            js_filename = os.path.basename(parsed.path) or "script.js"
            save_content(js_url, js_folder, js_filename)
    
    # Download image files (optional)
    images_folder = os.path.join(CONTENT_DIR, "images")
    create_directory(images_folder)
    for img in soup.find_all("img"):
        src = img.get("src")
        if src:
            img_url = urljoin(BASE_URL, src)
            parsed = urlparse(img_url)
            img_filename = os.path.basename(parsed.path)
            if img_filename:  # Ensure we have a valid filename
                save_content(img_url, images_folder, img_filename)
    
    # Update asset paths in index.html so it loads local assets
    update_asset_paths()

if __name__ == "__main__":
    scrape_website()