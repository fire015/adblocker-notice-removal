import chromeWebstoreUpload from "chrome-webstore-upload";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BUILD_FILE = __dirname + "/../dist/build.zip";

const webStore = chromeWebstoreUpload({
  extensionId: process.env.EXTENSION_ID,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  refreshToken: process.env.REFRESH_TOKEN,
});

const publishFile = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const token = await webStore.fetchToken();
      await uploadFile(token);
      await publishExtension(token);
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};

const uploadFile = async (token) => {
  const res = await webStore.uploadExisting(fs.createReadStream(BUILD_FILE), token);

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
