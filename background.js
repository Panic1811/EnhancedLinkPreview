chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ triggerMethod: 'hover', longClickDuration: 500, theme: 'light' });
});
