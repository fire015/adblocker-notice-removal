document.getElementById("version").innerText = chrome.runtime.getManifest().version;

chrome.tabs.query({ active: true }, (tab) => {
  const url = getIssueURL(tab[0].url);
  document.getElementById("link").setAttribute("href", url);
});
