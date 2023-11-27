import "../styles/popup.scss";
import { getIssueURL, isYouTube } from "./utility";

const manifest = chrome.runtime.getManifest();

document.getElementById("version").innerText = manifest.version;

if (!("update_url" in manifest)) {
  document.getElementById("version").innerText += " (dev)";
}

chrome.tabs.query({ active: true }, (tab) => {
  if (isYouTube(tab[0].url)) {
    document.getElementById("report").innerHTML =
      '<span class="red">Cannot remove from YouTube (<a href="https://github.com/fire015/adblocker-notice-removal/issues/119" target="_blank">why?</a>)</span>';
  } else {
    const url = getIssueURL(tab[0].url);
    document.getElementById("link").setAttribute("href", url);
  }
});
