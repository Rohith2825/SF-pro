// Store original functions
const originalQuerySelector = document.querySelector;
const originalQuerySelectorAll = document.querySelectorAll;
const originalGetElementById = document.getElementById;
const originalGetElementsByClassName = document.getElementsByClassName;

// Text content mapping
const contentMap = {
  // Header Navigation
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
  "div.property.property-2 div.property__title": "Environments",
  "div.property.property-2 div.property__value": "3",
  "div.property.property-3 div.property__title": "Engagement",
  "div.property.property-3 div.property__value": "45%",
  "div.property.property-4 div.property__title": "Conversions",
  "div.property.property-4 div.property__value": "15%",
  "div.property.property-5 div.property__title": "Revenue",
  "div.property.property-5 div.property__value": "35%",
  "#powerful .sec-title[data-aos='fade-up']": "Giving <span class='gradiently'>You</span> 3D Superpowers",
  "#fast-growing .sec-title span.gradiently": "Deltoids",
  // Update the static part (currently "One click Swap & Earn on") to "Build your"
  "section.first .first__subtitle > div.flex:first-of-type > span:first-of-type": "Build your",

  // Update the rotating tokens.
  // Originally, the first token is "Native" (in a span with underline). We'll replace it:
  "section.first .first__subtitle > div.flex:first-of-type > span.relative > span.mr-1.5.underline": "store",
  // Now update the next three tokens to our rotation words:
  "section.first .first__subtitle div.flex > span.relative > span:nth-of-type(1)": "Store",
  "section.first .first__subtitle div.flex > span.relative > span:nth-of-type(2)": "dynamic",
  "section.first .first__subtitle div.flex > span.relative > span:nth-of-type(3)": "vibrant",
  "section.first .first__subtitle div.flex > span.relative > span:nth-of-type(4)": "innovative",
  "section.first .first__subtitle div.flex > span.relative > span:nth-of-type(5)": "creative",
  "section.first .first__subtitle div.flex > span.relative > span:nth-of-type(6)": "futuristic",
  "section.first .first__subtitle div.flex > span.relative > span:nth-of-type(7)": "modern",
  "section.first .first__subtitle div.flex > span.relative > span:nth-of-type(8)": "sleek",
  "section.first .first__subtitle div.flex > span.relative > span:nth-of-type(9)": "trendsetting",
  "section.first .first__subtitle div.flex > span.relative > span:nth-of-type(10)": "revolutionary",
  

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

// Function to update and maintain the search input placeholder
function updateSearchPlaceholder(input) {
  const desiredText = "Search different products across 10+ experiences...";
  // Immediately set the placeholder if it doesn't match
  if (input.placeholder !== desiredText) {
    input.placeholder = desiredText;
  }
  
  // Set up an observer on this input to monitor for changes to its placeholder attribute
  const placeholderObserver = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.type === "attributes" && mutation.attributeName === "placeholder") {
        if (input.placeholder !== desiredText) {
          input.placeholder = desiredText;
        }
      }
    });
  });
  
  placeholderObserver.observe(input, { attributes: true });
}

// Handle special case updates
function handleSpecialCases(element) {
  // Update video source (unchanged)
  const videoSources = element.querySelectorAll("section#first video source");
  videoSources.forEach(source => {
    if (source.getAttribute('src') !== "./starter.mp4") {
      source.setAttribute('src', "./starter.mp4");
      const video = source.parentElement;
      if (video && video.tagName === 'VIDEO') {
        try {
          video.load();
        } catch (e) {
          // Ignore errors
        }
      }
    }
  });
  
  // Update search placeholder for both sticky and non-sticky search inputs
  // This covers both "#downshift-1-input" and "#downshift-0-input"
  const desiredPlaceholder = "Search different products across 10+ experiences...";
  const searchInputs = element.querySelectorAll("#downshift-1-input, #downshift-0-input");
  searchInputs.forEach(input => {
    // Immediately set the placeholder if needed
    if (input.placeholder !== desiredPlaceholder) {
      input.placeholder = desiredPlaceholder;
    }
    
    // Attach an observer to lock in the desired placeholder
    const placeholderObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === "attributes" && mutation.attributeName === "placeholder") {
          if (input.placeholder !== desiredPlaceholder) {
            input.placeholder = desiredPlaceholder;
          }
        }
      });
    });
    
    placeholderObserver.observe(input, { attributes: true });
  });
  
  // Update watch image (unchanged)
  const watchImgs = element.querySelectorAll('img[src="assets/svg/watch.svg"]');
  watchImgs.forEach(img => {
    img.src = "./watch.svg";
  });

    const logoImg = document.querySelector("header a.header__logo picture img");
    if (logoImg) {
      logoImg.src = "./logo.avif"; // Set your new logo path here
    } else {
      console.warn("Logo image element not found.");
    }

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