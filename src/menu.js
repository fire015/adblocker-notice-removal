chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "report",
      title: "Report issue with website",
      contexts: ["action"],
    });
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "report") {
    chrome.tabs.create({
      url: "https://github.com/fire015/adblocker-notice-removal/issues/new",
    });
  }
});
