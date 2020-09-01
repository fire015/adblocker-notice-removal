chrome.runtime.onInstalled.addListener(() => {
  fetch(chrome.runtime.getURL("rules.json"))
    .then((response) => response.json())
    .then((rules) => chrome.storage.local.set({ rules }));
});
