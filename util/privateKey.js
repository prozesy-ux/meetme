const admin = require("firebase-admin");

// Private key loaded lazily from env or settingJSON

const initFirebase = async () => {
  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(privateKey),
      });
      console.log("✅ Firebase Admin SDK initialized successfully");
    }
    return admin;
  } catch (error) {
    console.error("Failed to initialize Firebase Admin SDK:", error);
    throw error;
  }
};

module.exports = initFirebase();
