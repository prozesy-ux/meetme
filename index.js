//express
const express = require("express");
const app = express();

//cors
const cors = require("cors");
app.use(cors());
app.use(express.json());

//logging middleware
const logger = require("morgan");
app.use(logger("dev"));

//path
const path = require("path");

//fs
const fs = require("fs");

//dotenv
require("dotenv").config({ path: ".env" });

//socket io
const http = require("http");
const server = http.createServer(app);
global.io = require("socket.io")(server);

//connection.js
const db = require("./util/connection");

//Declare global variable
global.settingJSON = {};

//Declare the function as a global variable to update the setting.js file
global.updateSettingFile = (settingData) => {
  const settingJSON = JSON.stringify(settingData, null, 2);
  fs.writeFileSync("setting.js", `module.exports = ${settingJSON};`, "utf8");

  global.settingJSON = settingData; // Update global variable
  console.log("Settings file updated.");
};

//Step 1: Import initializeSettings
const initializeSettings = require("./util/initializeSettings");

async function startServer() {
  console.log("🔄 Initializing settings...");
  await initializeSettings();
  console.log("✅ Settings Loaded");

  //Step 2: Require all other modules after settings are initialized
  const routes = require("./routes/route");
  app.use("/api", routes);

  require("./socket");

  app.use("/storage", express.static(path.join(__dirname, "storage")));

  db.on("error", () => {
    console.log("Connection Error: ");
  });

  db.once("open", async () => {
    console.log("Mongo: successfully connected to db");
  });

  //Step 3: Start Server after all setup is done
  server.listen(process?.env.PORT, () => {
    console.log("Hello World ! listening on " + process?.env?.PORT);
  });
}

//Run server startup
startServer();

// const admin = require("firebase-admin");
// const serviceAccount = {
//     "type": "service_account",
//     "project_id": "figgy-3139d",
//     "private_key_id": "3ff5c810db4501d40876c618313b7a434bab2e4c",
//     "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCG2ZOL50Ack/ZL\nyz4Vv8RZPzo9NoahZ9R65WI8l02oWWb9Ba1fEF8c4sxXvwZuBW8pMpcN1wwxFGOD\nZe2XHNZWTL7cSz8R7Qp8c3voAp1rEs+FTaixgE98pzfuG885Zev2xWk2EBcAgGxE\nK2+Gt17w3NxCBSZIYUmKt0jwhp7jjLTcG6WF5qSyCqcWgxu1Od9qBN6AWFfcV1g1\n9Sj9N/GHCSJq60hgNB/Xq03svDPEg2eu7W4Qvwnz7aJC+Fkue2NSGTZV9O4ynHF2\nr2bsOKqM7rDvEYzDlabB/oqR5UmeI9cV0KBQPyIclxQrJXs3dcZGw9HZzt6UHSG6\nQDKBfHb7AgMBAAECggEAMTPlNqhnh6XjOa+MVTI16dx8mwYwpGb2q+rTZ8lLMBCC\n1/KA2k1mbus/5QpRxcYc07reS9H55FSMpM6FnNwMRsvU3htkhV1otJUMklCV8JIZ\n/wkhcrafChwXd71U5JwQN2e7ZlsDkY7KMitpE44HybnEciBf4gwBYehTaFOuWNcg\nL9+0T9sP8lFvfbAPJwZhotNnsXGmiNjSlqNvsN3Kn1JKC5EApjop4oVtQN2O16AR\natRYkOSvYIZHv2Qv6c5/RVOKF+u8LsWiTkS1HXUdNZPLXLZU+kcFEmy0DofY5iMk\npXEaP6VXu9GIDGkFo1kL4XvJ0/Af0GBwL9KfrFtI8QKBgQC9YhB8r8ZJL3DuGcqj\nAmpWCKKOCxc7lajE7rjFt8z9iwhmeDcnqfg9OO2WmsQ00o+X2ZiuH/Cefw9H+mSk\nQ3H2dl1b1x6Ro6uW8uU1TO0iEX6pFPc9zgVZXCFWP99Pt1cv2Ow2Gp7iAvZXpL+8\nhLhS0UYIRel9OiGqkARAi65QMQKBgQC2SM3MPgFQJFlJfGxH3m+gv6yNgOdgIlqK\np738yENU1m6ii4QomXg/hEzONhD8cYGil5amWfn2WDqo3elVPcmXeAn9aZq8LR03\nl1f4e/Ke2uO7r6stCB3e6Qx7HrpfkCLn8pIUpvi5O70eYC1merL3uj80NDxbJGXH\nGgRd13n66wKBgDK525SqOEBOFr+P5Pj4oqbctT26tsRc99GX56H980hOPzfDJ3LW\nUgmEAA+A8OD9LT0NKZoqL/ckLWGoLeDZt+K+HY+F9UgpQMKz2LUIH9QqP3Tmirrh\nPgmLZdqGTTg68X19aveq9bev92/OTxUdr4lvSITaxQmn0nCvFpR7VXthAoGASRsx\nznQfurCZTqukEb7YLjQxVB8arKeagHl97N+0gVXu0Sn7Ov0yCOdalmmArn4na7o4\nJUd4xJ/mBsvZROKe8yyldQjhkg7V5PHBylqLl8JaC3AMyuaydDArXUWZobIBDd1v\nUPEWV9PpqUERdERJeqkrqBg7DKKwXwXEMo600TkCgYEAhWX4Qa0sKlu1CKbOCWPW\n2Bjg8ajwlEisv4APvPH5BnP13gkoj8SFgkMCGW08PIq8jf3zVZI8S6dq8XeFG0Uo\nkg4DZur803xH26sualTvOEsioxNGY/9UxxBAkAam6Y02VFNKq9VA7A9GGsoK8913\n4DdzX2VSFjpNqIpi4NUAwJY=\n-----END PRIVATE KEY-----\n",
//     "client_email": "firebase-adminsdk-fbsvc@figgy-3139d.iam.gserviceaccount.com",
//     "client_id": "101194081339872633919",
//     "auth_uri": "https://accounts.google.com/o/oauth2/auth",
//     "token_uri": "https://oauth2.googleapis.com/token",
//     "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
//     "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40figgy-3139d.iam.gserviceaccount.com",
//     "universe_domain": "googleapis.com"
//   };

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// async function deleteAllUsers(nextPageToken) {
//   try {
//     const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);    
//     const uids = listUsersResult.users.map(user => user.uid);

//     console.log(`Fetched ${uids.length} users`);

//     if (uids.length > 0) {
//       const result = await admin.auth().deleteUsers(uids);
//       console.log(`✅ Deleted ${result.successCount} users`);
//       if (result.failureCount > 0) {
//         console.log(`❌ Failed to delete ${result.failureCount} users`);
//         result.errors.forEach(err => {
//           console.error(`Error for UID ${err.index}: ${err.error}`);
//         });
//       }
//     } else {
//       console.log("⚠️ No users found to delete.");
//     }

//     if (listUsersResult.pageToken) {
//       console.log("⏭ Fetching next page of users...");
//       await deleteAllUsers(listUsersResult.pageToken);
//     } else {
//       console.log("✅ All users processed.");
//     }
//   } catch (error) {
//     console.error("❌ Error while deleting users:", error);
//   }
// }

// deleteAllUsers();
