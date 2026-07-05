const admin = require("firebase-admin");

// Private key loaded lazily from env or settingJSON

const initFirebase = async () => {
  try {
    if (!admin.apps.length) {
      const privateKey = global.settingJSON?.privateKey || {
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      };

      if (!privateKey.projectId) {
        console.warn("⚠️ Firebase credentials not configured - skipping init");
        return admin;
      }

      admin.initializeApp({
        credential: admin.credential.cert(privateKey),
      });
      console.log("✅ Firebase Admin SDK initialized successfully");
    }
    return admin;
  } catch (error) {
    console.error("Failed to initialize Firebase Admin SDK:", error.message);
    return admin;
  }
};

module.exports = initFirebase();
