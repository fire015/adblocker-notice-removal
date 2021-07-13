chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "showBadge") {
    chrome.action.setBadgeBackgroundColor({ color: "#6b6b6b" });
    chrome.action.setBadgeText({ text: "✓" });
    chrome.alarms.create({ when: Date.now() + 3000 });
  }
});

chrome.alarms.onAlarm.addListener(() => {
  chrome.action.setBadgeText({ text: "" });
});
