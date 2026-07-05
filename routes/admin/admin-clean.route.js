const express = require("express");
const route = express.Router();

// Load dependencies at module level
const Admin = require("../../models/admin.model");
const Login = require("../../models/login.model");
const Cryptr = require("cryptr");
const admin = require("firebase-admin");

const cryptr = new Cryptr(process.env.CRYPTR_KEY || "default-secret-key");

// Initialize Firebase Admin (check if already initialized)
if (!admin.apps.length) {
  const serviceAccount = {
    type: "service_account",
    project_id: "meetme-9ff7c",
    private_key_id: "e4c2c1261e8052b054c8085fc67847c020e3b5b1",
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDl3RLEmxLLdIIe\n31bZFl7yvyuf4qLZ3U0j5+nDhw1cEKYLbj+0GBSsDy6ZqknG2ErFtccsS2AECAfL\n4QZBMn3GowKE4uCCyd7lqFtaj/AfAMCj97FLJHoHQ8Mzk6vbIfNDxf5IRHnV+nbp\niLr9VweHH5ShKGyCKiHuCAfwHuXBnKnxG4sIdNNBVI2M/kDbnN2xESlxZLq3LHu4\ndPAOE/4b88Jzg1kCqxjXslTxuRbOrWUdnYttN8rM7+WQ8+EXoufNquNtzSyAmdhB\nSR1aqcl64+s1TZiH6TMYqXuI1bCzf/gQugFFxQo3aYmSlUK7+cbPO3bvfr8QQ2jC\nHz95otNJAgMBAAECggEAEw9J4JqD1vHyCNGiYmgb9ws0o1JyssJKWgP/Wqf79W/T\nTNcB75LK7VoUQPKhS8cggBSqug4FR/WggTPHRdMEIds0uMRqiFMT0+gqAbA2DA65\nv9QofnS9AkAzUzdXRIQj/IZ80gziK1opeljM5HfPFycJDHSNIXKRPgBVeYAeXfd8\nK60DwiFV8cBZ3tXOMRc182e48JJcc979yiNzqB7YOjuf8HBZKgCwtGlU5ycgsbId\nYmPGi9m2fdYRljZM7H7IRxg0YRGK9PDb1CWO8B7fUBCjC8juuONaTPpV1q0rtYoH\nMUFNjHEAblTBtTt6DwMAue7MwegGJBZ47wshHOhPGQKBgQD17ZGgnpuzb8g+dCPw\nrJrE7GfS3kNhIcXBrCrzP/PmDXyI2XzzCqdvW7406dHpEnNO6G96ENZvSC85j02U\nNFZqF3WKYTs+eTl8pWxCRN7k+mII87Ua5IHWmJjwM1OmV77nGWZSlr4G9B5CYOS+\nC9sXLswNLMfr25wFm946gcjblQKBgQDvRxOyqRyOy9N6Q5afqXc1Z7ztYaS4lZek\naS1g1KJdxlEfA2cj7bRH6Hnil9oe8YI7HiDLOY3mIq8QgkNvW6VFfhgaHyiJg5K6\nhKipmqJVp1n0Ezmy106OpfUqrEZrz1VnFZhIZdc168+fQfcG/C7PTYuLTPN74hzq\njn8CB6sL5QKBgQDlqDoTZap/Mccs02Zwra9GcIIwQFFp1pEHYJEnYbSRREzkuz1c\n9bkQW/tPDH9zCUDXEmZv9mNZvm4jcXiACzQblNa2KECcAba2eQCVDh2cdVmxhGy+\ntV+umAhSX4whTdW/mE+elpjUg4nycOuLsiSiDJiPQR9dWVLlRf6MYoDA1QKBgQDA\nODEyzXgLnuJ8zd8q1FDXrkavzEkvn7z6byPtLeRhwPdaGrm4uzSgr7l6ttKbGRit\ntT5TBCFiR2qrsHnL86uJcAqcsXs3PWOaQwfbeEYA2TgCQ4+OhDivj9KsPUk1QpIx\nBcAYKPgCcTWRksSH7/8KuhjoByFy2+qu41pUnyRhoQKBgQDgjjwyjm3jP8nSTy8V\nO/SGeVxODxOcIq+pNg87mmJOoly2RQdUjtqN6hkvjzHFCc+aYoFBIu21tKiuhDB/\nj+MsP2LLG4lAuwGczM+3N9d95pq5ceyQYbQV7g8KQN0LvGfy2pYzjnEJe/7qjnBX\n/yzBEgJ6IRWkCatQHub4XAsFDg==\n-----END PRIVATE KEY-----\n",
    client_email: "firebase-adminsdk-fbsvc@meetme-9ff7c.iam.gserviceaccount.com",
    client_id: "102575459862864809506",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40meetme-9ff7c.iam.gserviceaccount.com",
    universe_domain: "googleapis.com"
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: "meetme-9ff7c"
  });
  console.log("✅ Firebase Admin SDK initialized");
}

console.log("✅ admin-clean.route.js loaded with dependencies");

// LOGIN ENDPOINT - FULL IMPLEMENTATION
route.post("/validateAdminLogin", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log("🔵 Login attempt:", { email });

    if (!email || !password) {
      return res.status(400).json({
        status: false,
        message: "Email and password are required"
      });
    }

    const admin = await Admin.findOne({ email: email.trim() })
      .select("_id uid email password purchaseCode name")
      .lean();

    if (!admin) {
      console.log("❌ Admin not found:", email);
      return res.status(401).json({
        status: false,
        message: "Invalid email or password"
      });
    }

    console.log("✅ Admin found:", { email, uid: admin.uid, storedPasswordLength: admin.password?.length });

    // Try decrypting password, fallback to plain text comparison
    let passwordMatches = false;
    try {
      console.log("🔵 Attempting to decrypt password...");
      const decryptedPassword = cryptr.decrypt(admin.password);
      console.log("✅ Password decrypted successfully");
      passwordMatches = (decryptedPassword === password);
    } catch (err) {
      console.log("⚠️ Decryption failed, trying plain text comparison:", err.message);
      // If decryption fails, try plain text comparison (for manually entered passwords)
      passwordMatches = (admin.password === password);
      if (passwordMatches) {
        console.log("✅ Plain text password matched, encrypting for future use...");
        // Encrypt the password for next time
        try {
          const encryptedPassword = cryptr.encrypt(password);
          await Admin.updateOne({ email }, { password: encryptedPassword });
        } catch (encryptErr) {
          console.error("⚠️ Could not encrypt password:", encryptErr.message);
        }
      }
    }

    if (!passwordMatches) {
      console.log("❌ Password mismatch for:", email);
      return res.status(401).json({
        status: false,
        message: "Invalid email or password"
      });
    }

    // Update login status
    await Login.updateOne({}, { $set: { login: true } }, { upsert: true });

    console.log("✅ Admin logged in:", email);

    return res.status(200).json({
      status: true,
      message: "Admin has successfully logged in.",
      data: { _id: admin._id, uid: admin.uid, email: admin.email, name: admin.name, purchaseCode: admin.purchaseCode }
    });
  } catch (error) {
    console.error("❌ Login error:", error.message);
    return res.status(500).json({
      status: false,
      message: error.message || "Internal Server Error"
    });
  }
});

// ADMIN PASSWORD RESET ENDPOINT (for setup/troubleshooting)
route.post("/resetAdminPassword", async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ status: false, message: "Email and newPassword required" });
    }

    const encryptedPassword = cryptr.encrypt(newPassword);
    const result = await Admin.updateOne(
      { email: email.trim() },
      { password: encryptedPassword }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ status: false, message: "Admin not found" });
    }

    console.log("✅ Admin password reset:", email);
    res.json({ status: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("❌ Password reset error:", error.message);
    res.status(500).json({ status: false, message: error.message });
  }
});

// FIREBASE USER SETUP ENDPOINT (for admin authentication)
route.post("/setupFirebaseUser", async (req, res) => {
  try {
    const { email, password, uid } = req.body;

    if (!email || !password || !uid) {
      return res.status(400).json({ status: false, message: "Email, password, and uid required" });
    }

    console.log("🔵 Setting up Firebase user:", { email, uid });

    // Check if user already exists in Firebase
    let firebaseUser;
    try {
      firebaseUser = await admin.auth().getUser(uid);
      console.log("✅ Firebase user already exists, updating password...");
      // Update password
      await admin.auth().updateUser(uid, { password });
      console.log("✅ Firebase user password updated");
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        console.log("🔵 Firebase user not found, creating new user...");
        // Create new user
        firebaseUser = await admin.auth().createUser({
          email,
          password,
          uid
        });
        console.log("✅ Firebase user created:", firebaseUser.uid);
      } else {
        throw err;
      }
    }

    return res.json({ status: true, message: "Firebase user setup successful", uid: firebaseUser.uid });
  } catch (error) {
    console.error("❌ Firebase setup error:", error.message);
    res.status(500).json({ status: false, message: error.message });
  }
});

module.exports = route;
