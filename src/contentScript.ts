import { CustomScripts } from "./custom";
import _rules from "./rules.json";
import { Rule, Rules } from "./types";
const rules: Rules = _rules;

let hasShownBadge = false;
let removalAttempts = 25;

const log = (msg: string) => {
  if (!("update_url" in chrome.runtime.getManifest())) {
    console.log("****** " + msg);
  }
};

const showBadge = () => {
  if (hasShownBadge) {
    return;
  }

  hasShownBadge = true;
  chrome.runtime.sendMessage({ action: "showBadge" });
};

const checkOverflowHidden = (rule: Rule) => {
  let attempts = 0;

  const interval = setInterval(() => {
    attempts++;

    if (attempts === removalAttempts) {
      clearInterval(interval);
    }

    checkOverflowHiddenEl("html", rule);
    checkOverflowHiddenEl("body", rule);
  }, 200);
};

const checkOverflowHiddenEl = (el: string, rule: Rule) => {
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
    log("Setting " + el + " overflow to visible");
    e.style.cssText = "overflow: visible !important";

    if (computedStyle.getPropertyValue("position") === "fixed") {
      log("Setting " + el + " position to static");
      e.style.cssText += "position: static !important";
    }
  }

  if (rule["topClassToRemove"] && e.classList.contains(rule["topClassToRemove"])) {
    log("Removing top class ." + rule["topClassToRemove"]);
    e.classList.remove(rule["topClassToRemove"]);
  }
};

const runRule = (rule: Rule) => {
  if (rule["customScriptToRun"]) {
    const cs = new CustomScripts();

    if (typeof cs[rule["customScriptToRun"]] === "function") {
      log("Running custom script " + rule["customScriptToRun"]);
      cs[rule["customScriptToRun"]](showBadge);
    }

    return;
  }

  rule["elementsToRemove"].forEach((el) => {
    document.arrive(el, { onceOnly: true }, (e: HTMLElement) => removeElement(el, e, rule, 0));
  });
};

const removeElement = (el: string, e: HTMLElement, rule: Rule, attempts: number) => {
  if (rule["removalAttempts"]) {
    removalAttempts = rule["removalAttempts"];
  }

  if (attempts === removalAttempts) {
    return;
  }

  const computedStyle = window.getComputedStyle(e);

  if (computedStyle.getPropertyValue("display") === "none") {
    setTimeout(() => removeElement(el, e, rule, attempts + 1), 200);
    return;
  }

  log("Removing " + el);
  e.remove();
  showBadge();
  checkOverflowHidden(rule);

  // .fEy1Z2XT = admiral
  if (rule["rebindRules"] || el === ".fEy1Z2XT") {
    log("Rebinding rule...");
    runRule(rule);
  }
};

const isHostnameMatched = (hostname: string, hostnameToMatch: string): boolean => {
  return hostname.slice(-hostnameToMatch.length) === hostnameToMatch;
};

const run = () => {
  if (!document.arrive) {
    log("Cannot observe document");
    return;
  }

  for (const r in rules) {
    const matches = rules[r]["matches"];

    for (let i = 0; i < matches.length; i++) {
      if (isHostnameMatched(window.location.hostname, matches[i])) {
        log("Found match for " + r + " on " + matches[i]);
        runRule(rules[r]);
        return;
      }
    }
  }

  runRule(rules["_common"]);
  log("No match found");
};

run();
