chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    title: "Report issue with website",
    contexts: ["browser_action"],
    onclick: () => {
      chrome.tabs.create({ url: "https://github.com/fire015/adblocker-notice-removal/issues/new" });
    },
  });
});
