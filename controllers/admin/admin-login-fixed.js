const Admin = require("../../models/admin.model");
const Login = require("../../models/login.model");
const cryptr = require("../../util/cryptr");

// Simple, working admin login
exports.validateAdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log("🔵 Login attempt:", { email });

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        status: false,
        message: "Email and password are required"
      });
    }

    // Find admin by email
    const admin = await Admin.findOne({ email: email.trim() })
      .select("_id uid email password purchaseCode name")
      .lean();

    if (!admin) {
      console.log("❌ Admin not found with email:", email);
      return res.status(401).json({
        status: false,
        message: "Invalid email or password"
      });
    }

    // Verify password
    try {
      const decryptedPassword = cryptr.decrypt(admin.password);
      
      if (decryptedPassword !== password) {
        console.log("❌ Wrong password for:", email);
        return res.status(401).json({
          status: false,
          message: "Invalid email or password"
        });
      }
    } catch (err) {
      console.error("❌ Password verification error:", err.message);
      return res.status(500).json({
        status: false,
        message: "Password verification failed"
      });
    }

    // Update login status
    await Login.updateOne({}, { $set: { login: true } }, { upsert: true });

    console.log("✅ Admin logged in:", email);

    // Return success with admin data
    return res.status(200).json({
      status: true,
      message: "Admin has successfully logged in.",
      data: {
        _id: admin._id,
        uid: admin.uid,
        email: admin.email,
        name: admin.name,
        purchaseCode: admin.purchaseCode
      }
    });
  } catch (error) {
    console.error("❌ validateAdminLogin error:", error.message);
    return res.status(500).json({
      status: false,
      message: error.message || "Internal Server Error"
    });
  }
};
