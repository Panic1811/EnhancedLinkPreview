let previewElement, previewTimer, options;

chrome.storage.sync.get({
  enabled: true,
  previewDelay: 500,
  previewSize: 'medium',
  previewPosition: 'smart'
}, function(items) {
  options = items;
});

function createPreviewElement(target, x, y) {
  if (previewElement) previewElement.remove();
  
  previewElement = document.createElement('div');
  previewElement.className = `link-preview ${options.previewSize}`;
  document.body.appendChild(previewElement);
  
  positionPreview(x, y);
  
  if (target.href) {
    previewLink(target);
  } else if (target.src) {
    previewImage(target);
  }
}

function positionPreview(x, y) {
  const rect = previewElement.getBoundingClientRect();
  let left = x + 10;
  let top = y + 10;
  
  if (options.previewPosition === 'smart') {
    if (left + rect.width > window.innerWidth) {
      left = window.innerWidth - rect.width - 10;
    }
    if (top + rect.height > window.innerHeight) {
      top = window.innerHeight - rect.height - 10;
    }
  }
  
  previewElement.style.left = `${left}px`;
  previewElement.style.top = `${top}px`;
}

function previewLink(target) {
  previewElement.innerHTML = '<p>Loading preview...</p>';
  
  fetch(target.href)
    .then(response => response.text())
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const title = doc.querySelector('title')?.textContent || 'No title';
      const description = doc.querySelector('meta[name="description"]')?.content || 
                          doc.querySelector('p')?.textContent?.slice(0, 150) + '...' || 
                          'No description available';
      const favicon = doc.querySelector('link[rel="icon"]')?.href || 
                      doc.querySelector('link[rel="shortcut icon"]')?.href ||
                      new URL('/favicon.ico', target.href).href;
      
      let content = `
        <div class="link-preview-title">
          <img src="${favicon}" alt="" class="link-preview-favicon" width="16" height="16">
          ${title}
        </div>
        <p class="link-preview-description">${description}</p>
      `;
      previewElement.innerHTML = content;
    })
    .catch(error => {
      previewElement.innerHTML = '<p>Error loading preview</p>';
      console.error('Error fetching preview:', error);
    });
}

function previewImage(target) {
  previewElement.innerHTML = `<img src="${target.src}" alt="Image preview" class="link-preview-image">`;
}

document.addEventListener('mouseover', function(event) {
  const target = event.target.closest('a') || (event.target.tagName === 'IMG' ? event.target : null);
  if (target && options.enabled) {
    previewTimer = setTimeout(() => {
      createPreviewElement(target, event.pageX, event.pageY);
    }, options.previewDelay);
  }
});

document.addEventListener('mouseout', function() {
  if (previewTimer) {
    clearTimeout(previewTimer);
  }
  if (previewElement) {
    previewElement.remove();
    previewElement = null;
  }
});
