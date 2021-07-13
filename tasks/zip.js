const fs = require("fs");
const archiver = require("archiver");

const zipDirectory = async () => {
  return new Promise((resolve, reject) => {
    const root = __dirname + "/..";
    const output = fs.createWriteStream(root + "/build.zip");
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", resolve);
    archive.on("error", reject);
    archive.on("warning", reject);

    archive.pipe(output);
    archive.directory(root + "/icon", "icon");
    archive.directory(root + "/src", "src");
    archive.file(root + "/background.js", { name: "background.js" });
    archive.file(root + "/manifest.json", { name: "manifest.json" });
    archive.file(root + "/rules.json", { name: "rules.json" });
    archive.finalize();
  });
};

console.log("Zipping in progress...");
zipDirectory()
  .then(() => console.log("Zip file created"))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
