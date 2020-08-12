let hasCheckedForOverflowHidden = false;

const log = (msg) => {
  if (!("update_url" in chrome.runtime.getManifest())) {
    console.log(msg);
  }
};

const checkOverflowHidden = () => {
  if (hasCheckedForOverflowHidden) {
    return;
  }

  hasCheckedForOverflowHidden = true;
  let timesRun = 0;

  const interval = setInterval(() => {
    timesRun++;

    if (timesRun === 25) {
      clearInterval(interval);
    }

    checkOverflowHiddenEl("html");
    checkOverflowHiddenEl("body");
  }, 200);
};

const checkOverflowHiddenEl = (el) => {
  const e = document.getElementsByTagName(el)[0];

  if (typeof e === "undefined") {
    return;
  }

  const computedStyle = window.getComputedStyle(e);

  if (
    computedStyle.getPropertyValue("overflow") === "hidden" ||
    computedStyle.getPropertyValue("overflow-x") === "hidden" ||
    computedStyle.getPropertyValue("overflow-y") === "hidden"
  ) {
    log("Setting " + el + " to visible");
    e.style["overflow"] = "visible";
  }
};

const setElementsToRemove = (elementsToRemove) => {
  elementsToRemove.forEach((el) => {
    document.arrive(el, { onceOnly: true }, (e) => {
      log("Removing " + el);
      e.remove();
      checkOverflowHidden();
    });
  });
};

const isURLMatched = (url, urlTemplate) => {
  const regex = createUrlRegex(urlTemplate);
  return Boolean(url.match(regex));
};

// https://github.com/darkreader/darkreader/blob/master/src/utils/url.ts
const createUrlRegex = (urlTemplate) => {
  urlTemplate = urlTemplate.trim();
  const exactBeginning = urlTemplate[0] === "^";
  const exactEnding = urlTemplate[urlTemplate.length - 1] === "$";

  urlTemplate = urlTemplate
    .replace(/^\^/, "") // Remove ^ at start
    .replace(/\$$/, "") // Remove $ at end
    .replace(/^.*?\/{2,3}/, "") // Remove scheme
    .replace(/\?.*$/, "") // Remove query
    .replace(/\/$/, ""); // Remove last slash

  let slashIndex;
  let beforeSlash;
  let afterSlash;

  if ((slashIndex = urlTemplate.indexOf("/")) >= 0) {
    beforeSlash = urlTemplate.substring(0, slashIndex); // google.*
    afterSlash = urlTemplate.replace("$", "").substring(slashIndex); // /login/abc
  } else {
    beforeSlash = urlTemplate.replace("$", "");
  }

  // SCHEME and SUBDOMAINS
  let result = exactBeginning
    ? "^(.*?\\:\\/{2,3})?" // Scheme
    : "^(.*?\\:\\/{2,3})?([^/]*?\\.)?"; // Scheme and subdomains

  // HOST and PORT
  const hostParts = beforeSlash.split(".");
  result += "(";

  for (let i = 0; i < hostParts.length; i++) {
    if (hostParts[i] === "*") {
      hostParts[i] = "[^\\.\\/]+?";
    }
  }

  result += hostParts.join("\\.");
  result += ")";

  // PATH and QUERY
  if (afterSlash) {
    result += "(";
    result += afterSlash.replace("/", "\\/");
    result += ")";
  }

  result += exactEnding
    ? "(\\/?(\\?[^/]*?)?)$" // All following queries
    : "(\\/?.*?)$"; // All following paths and queries

  return new RegExp(result, "i");
};

const run = (rules) => {
  for (const r in rules) {
    const matches = rules[r]["matches"];

    for (let i = 0; i < matches.length; i++) {
      if (isURLMatched(window.location.toString(), matches[i])) {
        log("Found match for " + r + " on " + matches[i]);
        setElementsToRemove(rules[r]["elementsToRemove"]);
        return;
      }
    }
  }

  log("No match found");
};

fetch(chrome.runtime.getURL("rules.json"))
  .then((response) => response.json())
  .then((rules) => run(rules));
