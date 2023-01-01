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
    const url = getIssueURL(tab.url);
    chrome.tabs.create({ url });
  }
});
