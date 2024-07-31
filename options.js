document.addEventListener('DOMContentLoaded', function() {
  chrome.storage.sync.get({
    enabled: true,
    previewDelay: 500,
    previewSize: 'medium',
    previewPosition: 'smart'
  }, function(items) {
    document.getElementById('enabled').checked = items.enabled;
    document.getElementById('previewDelay').value = items.previewDelay;
    document.getElementById('previewSize').value = items.previewSize;
    document.getElementById('previewPosition').value = items.previewPosition;
  });
});

document.getElementById('save').addEventListener('click', function() {
  chrome.storage.sync.set({
    enabled: document.getElementById('enabled').checked,
    previewDelay: parseInt(document.getElementById('previewDelay').value),
    previewSize: document.getElementById('previewSize').value,
    previewPosition: document.getElementById('previewPosition').value
  }, function() {
    alert('Options saved');
  });
});
