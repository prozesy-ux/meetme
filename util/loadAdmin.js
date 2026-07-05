const Cryptr = require("cryptr");

const cryptr = new Cryptr("MyTotallySecretKey");

module.exports = async function loadAdmin() {
  try {
    const Admin = require("../models/admin.model");
    
    // Try to find existing admin
    let admin = await Admin.findOne();
    
    if (admin) {
      console.log("✅ Admin found:", admin.email);
      
      // Update to match Firebase if different
      if (admin.email !== "business@prozesy.com") {
        console.log("📝 Updating admin email to: business@prozesy.com");
        await Admin.updateOne(
          { _id: admin._id },
          {
            email: "business@prozesy.com",
            password: cryptr.encrypt("ProKash@2.0")
          }
        );
        console.log("✅ Admin updated!");
      }
    } else {
      // Create new admin
      console.log("📝 Creating new admin...");
      const newAdmin = new Admin({
        uid: "admin-uid-" + Date.now(),
        email: "business@prozesy.com",
        password: cryptr.encrypt("ProKash@2.0"),
        name: "Admin",
        purchaseCode: "test"
      });
      
      await newAdmin.save();
      console.log("✅ Admin created!");
      console.log("📋 Credentials:");
      console.log("   Email: business@prozesy.com");
      console.log("   Password: ProKash@2.0");
    }
  } catch (error) {
    console.error("❌ Error loading admin:", error.message);
  }
};
