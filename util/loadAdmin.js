const Cryptr = require("cryptr");

const cryptr = new Cryptr("MyTotallySecretKey");

module.exports = async function loadAdmin() {
  try {
    const Admin = require("../models/admin.model");
    const cryptr = require("../util/cryptr");
    
    // Try to find existing admin
    let admin = await Admin.findOne();
    
    if (admin) {
      console.log("✅ Admin found:", admin.email);
      
      // Always ensure credentials match
      const correctEmail = "business@prozesy.com";
      const correctPassword = cryptr.encrypt("ProKash@1817");
      
      await Admin.updateOne(
        { _id: admin._id },
        {
          email: correctEmail,
          password: correctPassword,
          name: "Admin"
        }
      );
      console.log("✅ Admin updated!");
      console.log("📋 Login Credentials:");
      console.log("   Email: business@prozesy.com");
      console.log("   Password: ProKash@1817");
    } else {
      // Create new admin
      console.log("📝 Creating new admin...");
      const newAdmin = new Admin({
        email: "business@prozesy.com",
        password: cryptr.encrypt("ProKash@1817"),
        name: "Admin",
        purchaseCode: "admin-key-" + Date.now()
      });
      
      await newAdmin.save();
      console.log("✅ Admin created!");
      console.log("📋 Login Credentials:");
      console.log("   Email: business@prozesy.com");
      console.log("   Password: ProKash@1817");
    }
  } catch (error) {
    console.error("❌ Error loading admin:", error.message);
  }
};
