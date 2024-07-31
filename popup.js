document.addEventListener('DOMContentLoaded', function() {
  chrome.storage.sync.get({enabled: true}, function(items) {
    document.getElementById('enabled').checked = items.enabled;
  });

  document.getElementById('enabled').addEventListener('change', function() {
    chrome.storage.sync.set({enabled: this.checked});
  });

  document.getElementById('options').addEventListener('click', function() {
    chrome.runtime.openOptionsPage();
  });
});
