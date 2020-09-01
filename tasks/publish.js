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
    await uploadFile(file, token);
    await publishExtension(token);
    fs.unlink(file, resolve);
  });
};

const uploadFile = async (file, token) => {
  const res = await webStore.uploadExisting(fs.createReadStream(file), token);

  if (!res.uploadState || res.uploadState !== "SUCCESS") {
    throw new Error("Upload failed, response was: " + JSON.stringify(res));
  }
};

const publishExtension = async (token) => {
  const res = await webStore.publish("default", token);

  if (!res.status || res.status.length === 0 || res.status[0] !== "OK") {
    throw new Error("Publish failed, response was: " + JSON.stringify(res));
  }
};

console.log("Publishing file...");
publishFile()
  .then(() => console.log("Zip file published"))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
