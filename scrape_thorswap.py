import requests
from bs4 import BeautifulSoup
import os
import json
import re
import urllib.parse
from urllib.parse import urljoin

def create_directory(directory):
    """Create directory if it doesn't exist"""
    if not os.path.exists(directory):
        os.makedirs(directory)

def save_to_file(content, file_path):
    """Save content to a file"""
    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(content)
    print(f"Saved: {file_path}")

def download_resource(url, base_url, folder_path, resource_type):
    """Download a resource (JS, CSS, image) and save it to the appropriate folder"""
    try:
        # Handle relative URLs
        if not url.startswith(('http://', 'https://', '//')):
            full_url = urljoin(base_url, url)
        elif url.startswith('//'):
            full_url = f"https:{url}"
        else:
            full_url = url
            
        # Create a filename from the URL
        parsed_url = urllib.parse.urlparse(url)
        filename = os.path.basename(parsed_url.path)
        
        # If filename is empty or doesn't have extension, create one
        if not filename or '.' not in filename:
            filename = f"{resource_type}_{hash(url) % 10000}.{resource_type}"
            
        file_path = os.path.join(folder_path, filename)
        
        # Check if we've already downloaded this resource
        if os.path.exists(file_path):
            return filename
            
        # Download the resource
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(full_url, headers=headers)
        
        if response.status_code == 200:
            save_to_file(response.text, file_path)
            return filename
        else:
            print(f"Failed to download {full_url}, status code: {response.status_code}")
            return None
    except Exception as e:
        print(f"Error downloading {url}: {e}")
        return None

def process_html(html_content, base_url, base_dir):
    """Process HTML content and download all resources"""
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Create resource directories
    css_dir = os.path.join(base_dir, "css")
    js_dir = os.path.join(base_dir, "js")
    images_dir = os.path.join(base_dir, "images")
    
    create_directory(css_dir)
    create_directory(js_dir)
    create_directory(images_dir)
    
    resource_map = {
        "css": [],
        "js": [],
        "images": []
    }
    
    # Process stylesheets
    for link in soup.find_all('link', rel='stylesheet'):
        href = link.get('href')
        if href:
            css_filename = download_resource(href, base_url, css_dir, 'css')
            if css_filename:
                # Update href to point to local file
                link['href'] = f"css/{css_filename}"
                resource_map["css"].append({"original": href, "local": css_filename})
    
    # Process script tags
    for script in soup.find_all('script', src=True):
        src = script.get('src')
        if src:
            js_filename = download_resource(src, base_url, js_dir, 'js')
            if js_filename:
                # Update src to point to local file
                script['src'] = f"js/{js_filename}"
                resource_map["js"].append({"original": src, "local": js_filename})
    
    # Process images
    for img in soup.find_all('img', src=True):
        src = img.get('src')
        if src:
            img_filename = download_resource(src, base_url, images_dir, 'img')
            if img_filename:
                # Update src to point to local file
                img['src'] = f"images/{img_filename}"
                resource_map["images"].append({"original": src, "local": img_filename})
    
    # Process inline styles with url() references
    for style in soup.find_all('style'):
        if style.string:
            # Find all url() references
            urls = re.findall(r'url\([\'"]?([^\'")]+)[\'"]?\)', style.string)
            updated_style = style.string
            
            for url in urls:
                if url and not url.startswith('data:'):
                    css_resource = download_resource(url, base_url, css_dir, 'css')
                    if css_resource:
                        # Update URL in the style tag
                        updated_style = updated_style.replace(f'url({url})', f'url(css/{css_resource})')
                        
            style.string = updated_style
    
    # Save modified HTML
    modified_html = str(soup)
    save_to_file(modified_html, os.path.join(base_dir, "index.html"))
    
    return resource_map

def scrape_website(url):
    """Scrape website and download all resources"""
    print(f"Scraping {url}...")
    
    # Create base directory
    base_dir = "thorswap_content"
    create_directory(base_dir)
    
    # Get base URL for resolving relative URLs
    base_url = '/'.join(url.split('/')[:3])
    
    try:
        # Fetch the website content
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers)
        
        if response.status_code == 200:
            # Save original HTML
            original_html_path = os.path.join(base_dir, "original.html")
            save_to_file(response.text, original_html_path)
            
            # Process HTML and download resources
            resource_map = process_html(response.text, base_url, base_dir)
            
            # Create a summary file
            summary = {
                "url": url,
                "html_file": "index.html",
                "original_html": "original.html",
                "resources": resource_map
            }
            
            save_to_file(json.dumps(summary, indent=2), os.path.join(base_dir, "summary.json"))
            
            print(f"\nScraping completed! Content saved to {base_dir} directory")
            print(f"CSS files: {len(resource_map['css'])}")
            print(f"JavaScript files: {len(resource_map['js'])}")
            print(f"Image files: {len(resource_map['images'])}")
            
        else:
            print(f"Failed to fetch website. Status code: {response.status_code}")
    
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    website_url = "https://www.thorswap.finance/"
    scrape_website(website_url)