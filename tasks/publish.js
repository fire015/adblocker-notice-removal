const fs = require("fs");
const webStore = require("chrome-webstore-upload")({
  extensionId: process.env.EXTENSION_ID,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  refreshToken: process.env.REFRESH_TOKEN,
});

const publishFile = async () => {
  return new Promise(async (resolve) => {
    const token = await webStore.fetchToken();
    const file = __dirname + "/../build.zip";
    await webStore.uploadExisting(fs.createReadStream(file), token);
    await webStore.publish("default", token);
    fs.unlink(file);
    resolve();
  });
};

console.log("Publishing file...");
publishFile().then(() => console.log("Zip file published"));
