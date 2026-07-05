const express = require("express");
const route = express.Router();

// Load dependencies at module level
const Admin = require("../../models/admin.model");
const Login = require("../../models/login.model");
const Cryptr = require("cryptr");
const cryptr = new Cryptr(process.env.CRYPTR_KEY || "default-secret-key");

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

module.exports = route;
