import { getIssueURL, isIgnoredSite } from "./utility";

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
    const ignoreLink = isIgnoredSite(tab.url);

    if (ignoreLink) {
      chrome.tabs.create({ url: ignoreLink });
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
