import { getIssueURL, isYouTube } from "./utility";

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

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "showBadge") {
    chrome.action.setBadgeBackgroundColor({ color: "#6b6b6b" });
    chrome.action.setBadgeText({ text: "✓" });
    chrome.alarms.create({ when: Date.now() + 3000 });
  }
});

chrome.alarms.onAlarm.addListener(() => {
  chrome.action.setBadgeText({ text: "" });
});
