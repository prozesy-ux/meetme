const Login = require("../../models/login.model");
const cryptr = require("../../util/cryptr");

//get login or not
exports.get = async (req, res) => {
  try {
    const Admin = require("../../models/admin.model");
    
    // Check if any admin exists
    const adminExists = await Admin.findOne().lean();
    
    // Determine the login status based on admin existence
    const loginStatus = !!adminExists;
    
    // Ensure Login document exists and matches admin status
    let login = await Login.findOne().lean();
    if (!login) {
      const newLogin = new Login({ login: loginStatus });
      await newLogin.save();
      login = newLogin;
    } else if (login.login !== loginStatus) {
      // Update if status has changed
      await Login.updateOne({}, { $set: { login: loginStatus } });
    }
    
    console.log(`[LOGIN-CHECK] Admin exists: ${!!adminExists}, Login status: ${loginStatus}`);
    return res.status(200).json({ status: true, message: "Success", login: loginStatus });
  } catch (error) {
    console.log(`[LOGIN-ERROR] ${error.message}`);
    return res.status(500).json({ status: false, error: error.message || "Internal Server Error" });
  }
};

// POST endpoint for admin login with email and password
exports.post = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        status: false,
        message: "Email and password are required"
      });
    }

    const Admin = require("../../models/admin.model");
    
    // Find admin by email
    const admin = await Admin.findOne({ email }).lean();
    
    if (!admin) {
      console.log(`[LOGIN-FAILED] Admin not found with email: ${email}`);
      return res.status(401).json({
        status: false,
        message: "Invalid email or password"
      });
    }

    // Decrypt and compare password
    try {
      const decryptedPassword = cryptr.decrypt(admin.password);
      
      if (decryptedPassword !== password) {
        console.log(`[LOGIN-FAILED] Wrong password for: ${email}`);
        return res.status(401).json({
          status: false,
          message: "Invalid email or password"
        });
      }
    } catch (decryptError) {
      console.error(`[LOGIN-DECRYPT-ERROR] ${decryptError.message}`);
      return res.status(500).json({
        status: false,
        message: "Password verification failed"
      });
    }

    // Generate a simple token (in production, use JWT)
    const token = `admin-token-${Date.now()}-${Math.random().toString(36)}`;
    
    // Update login status
    await Login.updateOne({}, { $set: { login: true } }, { upsert: true });
    
    console.log(`[LOGIN-SUCCESS] Admin logged in: ${email}`);
    
    return res.status(200).json({
      status: true,
      message: "Login successful",
      token: token,
      admin: {
        email: admin.email,
        name: admin.name,
        _id: admin._id
      }
    });
  } catch (error) {
    console.error(`[LOGIN-POST-ERROR] ${error.message}`);
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error"
    });
  }
};
