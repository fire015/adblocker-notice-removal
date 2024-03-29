import "../styles/popup.scss";
import { getIssueURL, isIgnoredSite } from "./utility";

const manifest = chrome.runtime.getManifest();

document.getElementById("version").innerText = manifest.version;

if (!("update_url" in manifest)) {
  document.getElementById("version").innerText += " (dev)";
}

chrome.tabs.query({ active: true, lastFocusedWindow: true }, ([tab]) => {
  const ignoreLink = isIgnoredSite(tab.url);

  if (ignoreLink) {
    document.getElementById("report").innerHTML =
      '<span class="red">Cannot remove from this site (<a href="' + ignoreLink + '" target="_blank">why?</a>)</span>';
  } else {
    const url = getIssueURL(tab.url);
    document.getElementById("link").setAttribute("href", url);
  }
});
