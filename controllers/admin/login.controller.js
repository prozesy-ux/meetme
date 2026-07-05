const Login = require("../../models/login.model");

// TEMP: delete admin collection for re-signup
exports.resetAdmin = async (req, res) => {
  try {
    const Admin = require("../../models/admin.model");
    await Admin.deleteMany({});
    await Login.updateOne({}, { $set: { login: false } }, { upsert: true });
    return res.status(200).json({ status: true, message: "Admin reset. Ready for fresh signup." });
  } catch (error) {
    return res.status(500).json({ status: false, error: error.message });
  }
};

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
