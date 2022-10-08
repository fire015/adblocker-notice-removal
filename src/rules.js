const parseRules = (rules) => {
  const matches = {};
  const elementsToRemove = {};

  for (const r in rules) {
    for (let i = 0; i < rules[r]["matches"].length; i++) {
      const url = rules[r]["matches"][i];
      const domain = removeWWW(url);
      const key = domain.charAt(0);
      const data = [url, r];

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

const removeWWW = (url) => {
  if (url.substring(0, 4) === "www.") {
    url = url.substr(4);
  }

  return url;
};

chrome.runtime.onInstalled.addListener(() => {
  fetch(chrome.runtime.getURL("rules.json"))
    .then((response) => response.json())
    .then((rules) => chrome.storage.local.set({ rules: parseRules(rules) }));
});
