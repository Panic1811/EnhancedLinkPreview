let previewElement, longClickTimer, options;

chrome.storage.sync.get({
  triggerMethod: 'hover',
  longClickDuration: 500,
  theme: 'light'
}, function(items) {
  options = items;
  document.body.classList.add(options.theme);
});

function showPreview(target, x, y) {
  if (previewElement) previewElement.remove();
  
  previewElement = document.createElement('div');
  previewElement.className = 'link-preview';
  previewElement.innerHTML = `
    <h3>${target.textContent}</h3>
    <p>Loading preview...</p>
    <button class="reader-view-btn">Reader View</button>
  `;
  
  document.body.appendChild(previewElement);
  
  previewElement.style.left = `${x + 10}px`;
  previewElement.style.top = `${y + 10}px`;
  
  fetch(target.href)
    .then(response => response.text())
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const title = doc.querySelector('title').textContent;
      const description = doc.querySelector('meta[name="description"]')?.content || 'No description available';
      
      previewElement.innerHTML = `
        <h3>${title}</h3>
        <p>${description}</p>
        <button class="reader-view-btn">Reader View</button>
      `;
      
      previewElement.querySelector('.reader-view-btn').addEventListener('click', () => showReaderView(doc));
    })
    .catch(error => {
      previewElement.innerHTML = `
        <h3>Error</h3>
        <p>Could not load preview</p>
      `;
    });
}

function showReaderView(doc) {
  const article = new Readability(doc).parse();
  previewElement.innerHTML = `
    <h1>${article.title}</h1>
    <div>${article.content}</div>
  `;
}

document.addEventListener('mouseover', function(event) {
  if (options.triggerMethod === 'hover') {
    const target = event.target;
    if (target.tagName === 'A' && target.href) {
      showPreview(target, event.pageX, event.pageY);
    }
  }
});

document.addEventListener('mousedown', function(event) {
  if (options.triggerMethod === 'longClick') {
    const target = event.target;
    if (target.tagName === 'A' && target.href) {
      longClickTimer = setTimeout(() => {
        showPreview(target, event.pageX, event.pageY);
      }, options.longClickDuration);
    }
  }
});

document.addEventListener('mouseup', function() {
  clearTimeout(longClickTimer);
});
