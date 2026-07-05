const admin = require("firebase-admin");

// Private key loaded lazily from env or settingJSON

//import model
const Admin = require("../models/admin.model");

const validateAdminFirebaseToken = async (req, res, next) => {
  console.log("🔹 [AUTH] Validating Admin Firebase token...");

  const authHeader = req.headers["authorization"];
  const adminUid = req.headers["x-admin-uid"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.warn("⚠️ [AUTH] Missing or invalid authorization header.");
    return res.status(401).json({ status: false, message: "Authorization token required" });
  }

  if (!adminUid) {
    console.warn("⚠️ [AUTH] Missing API key or Admin UID.");
    return res.status(401).json({ status: false, message: "Admin UID required for authentication." });
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);

    if (!decodedToken || !decodedToken.email) {
      console.warn("⚠️ [AUTH] Invalid token. Email not found.");
      return res.status(401).json({ status: false, message: "Invalid token. Authorization failed." });
    }

    console.log("🔍 [DEBUG] Decoded Token Email:", decodedToken?.email);
    console.log("🔍 [DEBUG] Decoded Token UID:", decodedToken?.uid);
    console.log("🔍 [DEBUG] Admin UID from Header:", adminUid);

    // First, try to find admin by the provided UID
    let mainAdmin = await Admin.findOne({ uid: adminUid }).select("_id email password uid");

    // If not found by UID, try to find by email (which is more reliable)
    if (!mainAdmin) {
      console.log("ℹ️ [AUTH] Admin not found by UID, attempting by email...");
      mainAdmin = await Admin.findOne({ email: decodedToken.email }).select("_id email password uid");
      
      if (mainAdmin && mainAdmin.uid !== decodedToken.uid) {
        // UID mismatch - update it to the current Firebase UID
        console.log("🔄 [AUTH] Syncing Firebase UID - Updating admin record");
        console.log("  Old UID:", mainAdmin.uid, "→ New UID:", decodedToken.uid);
        mainAdmin = await Admin.findByIdAndUpdate(
          mainAdmin._id,
          { uid: decodedToken.uid },
          { new: true }
        ).select("_id email password uid");
      }
    }

    if (mainAdmin) {
      console.log("🔍 [DEBUG] Admin found. Email:", mainAdmin.email, "UID:", mainAdmin.uid);
    } else {
      console.warn("⚠️ [AUTH] Admin not found with UID or email:", adminUid, decodedToken.email);
      return res.status(401).json({ status: false, message: "Admin not found. Authorization failed." });
    }

    req.admin = mainAdmin;
    console.log(`✅ [AUTH] Admin authentication successful. Admin ID: ${mainAdmin._id}`);
    next();
  } catch (error) {
    console.error("❌ [AUTH ERROR] Token verification failed:", error.message);
    return res.status(401).json({ status: false, message: "Invalid or expired token. Authorization failed." });
  }
};

module.exports = validateAdminFirebaseToken;
