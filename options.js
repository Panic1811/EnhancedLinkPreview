document.addEventListener('DOMContentLoaded', function() {
  const triggerMethod = document.getElementById('triggerMethod');
  const longClickDuration = document.getElementById('longClickDuration');
  const theme = document.getElementById('theme');
  const saveButton = document.getElementById('save');

  chrome.storage.sync.get(['triggerMethod', 'longClickDuration', 'theme'], function(items) {
    triggerMethod.value = items.triggerMethod;
    longClickDuration.value = items.longClickDuration;
    theme.value = items.theme;
  });

  saveButton.addEventListener('click', function() {
    chrome.storage.sync.set({
      triggerMethod: triggerMethod.value,
      longClickDuration: parseInt(longClickDuration.value),
      theme: theme.value
    }, function() {
      alert('Options saved');
    });
  });
});
