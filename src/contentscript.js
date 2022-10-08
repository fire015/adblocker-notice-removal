let hasCheckedForOverflowHidden = false;

const log = (msg) => {
  if (!("update_url" in chrome.runtime.getManifest())) {
    console.log(msg);
  }
};

const showBadge = () => {
  chrome.runtime.sendMessage({ action: "showBadge" });
};

const checkOverflowHidden = () => {
  if (hasCheckedForOverflowHidden) {
    return;
  }

  hasCheckedForOverflowHidden = true;
  showBadge();

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
    e.style.cssText = "overflow: visible !important";
  }
};

const setElementsToRemove = (elementsToRemove) => {
  elementsToRemove.forEach((el) => {
    document.arrive(el, { onceOnly: true }, (e) => removeElement(el, e, 0));
  });
};

const removeElement = (el, e, attempts) => {
  if (attempts === 25) {
    return;
  }

  const computedStyle = window.getComputedStyle(e);

  if (computedStyle.getPropertyValue("display") === "none") {
    setTimeout(() => removeElement(el, e, attempts + 1), 200);
    return;
  }

  log("Removing " + el);
  e.remove();
  checkOverflowHidden();
};

const isURLMatched = (hostname, urlToMatch) => {
  return hostname.slice(-urlToMatch.length) === urlToMatch;
};

const removeWWW = (url) => {
  if (url.substring(0, 4) === "www.") {
    url = url.substr(4);
  }

  return url;
};

const run = (rules) => {
  const domain = removeWWW(window.location.hostname);
  const key = domain.charAt(0);
  const matches = rules["matches"][key];

  for (let i = 0; i < matches.length; i++) {
    const [url, r] = matches[i];

    if (isURLMatched(window.location.hostname, url)) {
      log("Found match for " + r + " on " + url);
      setElementsToRemove(rules["elementsToRemove"][r]);
      return;
    }
  }

  log("No match found");
};

chrome.storage.local.get("rules", (result) => {
  if ("rules" in result) {
    run(result["rules"]);
  }
});
