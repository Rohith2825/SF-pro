// Store original functions
const originalQuerySelector = document.querySelector;
const originalQuerySelectorAll = document.querySelectorAll;
const originalGetElementById = document.getElementById;
const originalGetElementsByClassName = document.getElementsByClassName;

// Text content mapping
const contentMap = {
  // Header Navigation
  "header h1": "Delta XR",
  "header .menu a.link:nth-of-type(1)": "App",
  "header .menu a.link:nth-of-type(2)": "Services",
  "header .menu a.link:nth-of-type(3)": "Configurator",
  "header .menu a.link:nth-of-type(4)": "Templates",
  "header .menu a.link:nth-of-type(5)": "About",
  "header .btn-type-4": "Create Store",
  
  // Hero Section
  "section.first a.btn-type-2": "Create your own store",
  "section.first a#learn-more": "Learn More",
  "#learn-more div span": 'Get Immersive',
  
  // Custom content
  "div.sec-title[data-aos='fade-up']": 'The <span class="gradiently">Immersive</span> shopping experience',
  "div.col-12.t-a-c > div > div.sec-title[data-aos='fade-up']": '<span class="gradiently">Immersive•Shopping</span> Made Easy',
  "div.property.property-1 div.property__title": "Store Price",
  "div.property.property-1 div.property__value": "$50 USD",
  "#powerful .sec-title[data-aos='fade-up']": "Giving <span class='gradiently'>You</span> 3D Superpowers",
  "#fast-growing .sec-title span.gradiently": "Deltoids"
  // Add more mappings as needed
};

// Simple function to update a single element's content
function updateElementContent(element) {
  if (!element) return;
  
  // Check if this element matches any of our selectors
  for (const selector in contentMap) {
    try {
      if (element.matches && element.matches(selector)) {
        element.innerHTML = contentMap[selector];
        return;
      }
    } catch (e) {
      // Ignore errors from invalid selectors
    }
  }
  
  // Check if any child elements match our selectors
  if (element.querySelectorAll) {
    for (const selector in contentMap) {
      try {
        const matches = element.querySelectorAll(selector);
        matches.forEach(match => {
          match.innerHTML = contentMap[selector];
        });
      } catch (e) {
        // Ignore errors from invalid selectors
      }
    }
  }
}

// Handle special case updates
function handleSpecialCases(element) {
  // Update video source
  const videoSources = element.querySelectorAll("section#first video source");
  videoSources.forEach(source => {
    source.src = "./starter.mp4";
    const video = source.parentElement;
    if (video && video.tagName === 'VIDEO') {
      try {
        video.load();
      } catch (e) {
        // Ignore video loading errors
      }
    }
  });
  
  // Update search placeholder
  const searchInputs = element.querySelectorAll("#downshift-1-input");
  searchInputs.forEach(input => {
    input.placeholder = "Search different products across 10+ experiences...";
  });
  
  // Update watch image
  const watchImgs = element.querySelectorAll('img[src="assets/svg/watch.svg"]');
  watchImgs.forEach(img => {
    img.src = "./watch.svg";
  });
}

// Function to update content of an element and its children
function processElement(element) {
  if (!element) return;
  
  // Update this element
  updateElementContent(element);
  
  // Handle special cases
  handleSpecialCases(element);
  
  // Process children recursively
  if (element.children) {
    Array.from(element.children).forEach(child => {
      processElement(child);
    });
  }
}

// Set up mutation observer to detect new elements
const observer = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    // Handle added nodes
    mutation.addedNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        processElement(node);
      }
    });
    
    // Handle attribute changes that might affect visibility
    if (mutation.type === 'attributes' && 
        mutation.target && 
        mutation.target.nodeType === Node.ELEMENT_NODE) {
      updateElementContent(mutation.target);
    }
  });
});

// Start observing the document
document.addEventListener('DOMContentLoaded', () => {
  // Process the entire document first
  processElement(document.body);
  
  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'style', 'data-aos']
  });
  
  // Also process on scroll events for lazy-loaded content
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      processElement(document.body);
    }, 100);
  }, { passive: true });
});

// Process immediately to handle elements already in the DOM
processElement(document.body);