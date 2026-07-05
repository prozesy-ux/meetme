const Cryptr = require("cryptr");

const cryptr = new Cryptr("MyTotallySecretKey");

module.exports = async function loadAdmin() {
  try {
    const Admin = require("../models/admin.model");
    
    // Try to find existing admin
    let admin = await Admin.findOne();
    
    if (admin) {
      console.log("✅ Admin found:", admin.email);
      
      // Update to match Firebase
      const correctUID = "pzvkvAd5qNUuxw4fRlp3bwTXnVF3";
      const correctEmail = "business@prozesy.com";
      
      if (admin.uid !== correctUID || admin.email !== correctEmail) {
        console.log("📝 Updating admin record...");
        await Admin.updateOne(
          { _id: admin._id },
          {
            uid: correctUID,
            email: correctEmail,
            password: cryptr.encrypt("ProKash@2.0")
          }
        );
        console.log("✅ Admin updated!");
        console.log("📋 Updated Credentials:");
        console.log("   Email:", correctEmail);
        console.log("   Firebase UID:", correctUID);
      }
    } else {
      // Create new admin
      console.log("📝 Creating new admin...");
      const newAdmin = new Admin({
        uid: "pzvkvAd5qNUuxw4fRlp3bwTXnVF3",
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
      console.log("   Firebase UID: pzvkvAd5qNUuxw4fRlp3bwTXnVF3");
    }
  } catch (error) {
    console.error("❌ Error loading admin:", error.message);
  }
};
