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
  if (info.menuItemId === "report" && tab) {
    if (isYouTube(tab.url)) {
      chrome.tabs.create({ url: "https://github.com/fire015/adblocker-notice-removal/issues/119" });
    } else {
      const url = getIssueURL(tab.url);
      chrome.tabs.create({ url });
    }
  }
});
