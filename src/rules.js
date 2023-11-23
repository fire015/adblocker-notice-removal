async function getRules() {
  if (typeof GLOBAL_RULES !== "undefined") {
    return GLOBAL_RULES;
  }

  const response = await fetch(chrome.runtime.getURL("rules.json"));
  const rules = await response.json();

  return rules;
}
