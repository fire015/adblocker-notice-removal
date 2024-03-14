import _ignore from "./ignore.json";
import { IssueQueryStringParams, IgnoreRules } from "./types";
const ignoreRules: IgnoreRules = _ignore;

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

export function isIgnoredSite(url: string): string | null {
  const parsed = new URL(url);

  for (const r in ignoreRules) {
    const matches = ignoreRules[r]["matches"];

    for (let i = 0; i < matches.length; i++) {
      if (isHostnameMatched(parsed.hostname, matches[i])) {
        return ignoreRules[r]["link"];
      }
    }
  }

  return null;
}

export function isHostnameMatched(hostname: string, hostnameToMatch: string): boolean {
  return hostname.slice(-hostnameToMatch.length) === hostnameToMatch;
}
