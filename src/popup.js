const manifest = chrome.runtime.getManifest();

document.getElementById("version").innerText = manifest.version;

if (!("update_url" in manifest)) {
  document.getElementById("version").innerText += " (dev)";
}

chrome.tabs.query({ active: true }, (tab) => {
  const url = getIssueURL(tab[0].url);
  document.getElementById("link").setAttribute("href", url);
});
