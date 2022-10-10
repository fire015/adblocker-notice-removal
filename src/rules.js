const parseRules = (rules) => {
  const matches = {};
  const elementsToRemove = {};

  for (const r in rules) {
    for (let i = 0; i < rules[r]["matches"].length; i++) {
      const hostname = rules[r]["matches"][i];
      const key = stripSubdomain(hostname).charAt(0);
      const data = [hostname, r];

      if (key in matches) {
        matches[key].push(data);
      } else {
        matches[key] = [data];
      }
    }

    elementsToRemove[r] = rules[r]["elementsToRemove"];
  }

  return { matches, elementsToRemove };
};

const stripSubdomain = (hostname) => {
  const parts = hostname.split(".");

  return parts
    .slice(0)
    .slice(-(parts.length === 4 ? 3 : 2))
    .join(".");
};

chrome.runtime.onInstalled.addListener(() => {
  fetch(chrome.runtime.getURL("rules.json"))
    .then((response) => response.json())
    .then((rules) => chrome.storage.local.set({ rules: parseRules(rules) }));
});
