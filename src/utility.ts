import { IssueQueryStringParams } from "./types";

export function getIssueURL(currentURL: string): string {
  const params: IssueQueryStringParams = {};
  const manifest = chrome.runtime.getManifest();

  const question =
    "Extension version: " +
    manifest.version +
    "\nUser agent: " +
    navigator.userAgent +
    "\n\nWhich country are you browsing from? [ANSWER HERE]\n\nPlease take a screenshot of the adblocker notice and drag and drop the image here if possible.";

  if (currentURL) {
    const url = new URL(currentURL);
    params["title"] = "Issue with " + url.hostname;
    params["body"] = currentURL + "\n\n" + question;
  } else {
    params["title"] = "Issue with website";
    params["body"] = "URL:\n\n" + question;
  }

  const queryString = new URLSearchParams(params).toString();

  return "https://github.com/fire015/adblocker-notice-removal/issues/new?" + queryString;
}

export function isYouTube(url: string): boolean {
  const parsed = new URL(url);

  return parsed.hostname.indexOf("youtube") !== -1;
}
