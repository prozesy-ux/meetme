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

    try {
      console.log("🔵 Attempting to decrypt password...");
      const decryptedPassword = cryptr.decrypt(admin.password);
      console.log("✅ Password decrypted successfully");
      
      if (decryptedPassword !== password) {
        console.log("❌ Wrong password for:", email, { provided: password.substring(0, 3) + "***", stored: decryptedPassword.substring(0, 3) + "***" });
        return res.status(401).json({
          status: false,
          message: "Invalid email or password"
        });
      }
    } catch (err) {
      console.error("❌ Password verification failed:", err.message, { errorType: err.constructor.name });
      return res.status(500).json({
        status: false,
        message: "Password verification failed: " + err.message
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
    console.error("❌ Login error:", error.message, { stack: error.stack });
    return res.status(500).json({
      status: false,
      message: error.message || "Internal Server Error"
    });
  }
});

module.exports = route;
