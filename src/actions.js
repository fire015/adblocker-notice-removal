chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "showBadge") {
    chrome.action.setBadgeBackgroundColor({ color: "#6b6b6b" });
    chrome.action.setBadgeText({ text: "✓" });

    setTimeout(() => {
      chrome.action.setBadgeText({ text: "" });
    }, 3000);
  }
});
