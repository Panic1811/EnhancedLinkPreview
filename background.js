chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    enabled: true,
    previewDelay: 500,
    previewSize: 'medium',
    previewPosition: 'smart'
  });
});
