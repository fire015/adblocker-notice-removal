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

const isHostnameMatched = (hostname, hostnameToMatch) => {
  return hostname.slice(-hostnameToMatch.length) === hostnameToMatch;
};

const run = (rules) => {
  for (const r in rules) {
    const matches = rules[r]["matches"];

    for (let i = 0; i < matches.length; i++) {
      if (isHostnameMatched(window.location.hostname, matches[i])) {
        log("Found match for " + r + " on " + matches[i]);
        setElementsToRemove(rules[r]["elementsToRemove"]);
        return;
      }
    }
  }

  setElementsToRemove(rules["_common"]["elementsToRemove"]);

  log("No match found");
};

chrome.storage.local.get("rules", (result) => {
  if ("rules" in result) {
    run(result["rules"]);
  }
});
