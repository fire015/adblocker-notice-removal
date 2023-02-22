let hasShownBadge = false;
let removalAttempts = 25;

const log = (msg) => {
  if (!("update_url" in chrome.runtime.getManifest())) {
    console.log(msg);
  }
};

const showBadge = () => {
  if (hasShownBadge) {
    return;
  }

  hasShownBadge = true;
  chrome.runtime.sendMessage({ action: "showBadge" });
};

const checkOverflowHidden = () => {
  let attempts = 0;

  const interval = setInterval(() => {
    attempts++;

    if (attempts === removalAttempts) {
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

const setElementsToRemove = (rule) => {
  if (rule["removalAttempts"]) {
    removalAttempts = rule["removalAttempts"];
  }

  rule["elementsToRemove"].forEach((el) => {
    document.arrive(el, { onceOnly: true }, (e) => removeElement(el, e, 0));
  });
};

const removeElement = (el, e, attempts) => {
  if (attempts === removalAttempts) {
    return;
  }

  const computedStyle = window.getComputedStyle(e);

  if (computedStyle.getPropertyValue("display") === "none") {
    setTimeout(() => removeElement(el, e, attempts + 1), 200);
    return;
  }

  log("Removing " + el);
  e.remove();
  showBadge();
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
        setElementsToRemove(rules[r]);
        return;
      }
    }
  }

  setElementsToRemove(rules["_common"]);
  log("No match found");
};

chrome.storage.local.get("rules", (result) => {
  if ("rules" in result) {
    run(result["rules"]);
  }
});
