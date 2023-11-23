const fs = require("fs");
const rules = JSON.stringify(require("../rules.json"));
const rulesJSPath = __dirname + "/../src/rules.js";

let code = `const GLOBAL_RULES = ${rules};\n\n`;
code += fs.readFileSync(rulesJSPath, "utf8");

fs.writeFileSync(rulesJSPath, code, { encoding: "utf8" });

console.log("Written global rules to " + rulesJSPath);
