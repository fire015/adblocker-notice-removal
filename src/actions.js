chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "showBadge") {
    chrome.browserAction.setBadgeBackgroundColor({ color: "#6b6b6b" });
    chrome.browserAction.setBadgeText({ text: "✓" });

    setTimeout(() => {
      chrome.browserAction.setBadgeText({ text: "" });
    }, 3000);
  }
});
