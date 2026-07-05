const mongoose = require('mongoose');
const Admin = require('./models/admin.model.js');
const Cryptr = require('cryptr');

const cryptr = new Cryptr('MyTotallySecretKey');

async function createAdmin() {
  try {
    await mongoose.connect('mongodb+srv://admin:12345@cluster0.mongodb.net/meetme?retryWrites=true&w=majority');
    console.log('✅ Connected to MongoDB');
    
    // Check if admin already exists
    const existing = await Admin.findOne({ email: 'business@prozesy.com' });
    if (existing) {
      console.log('ℹ️ Admin already exists, updating...');
      await Admin.updateOne(
        { email: 'business@prozesy.com' },
        { password: cryptr.encrypt('ProKash@2.0') }
      );
    } else {
      // Create new admin
      const newAdmin = new Admin({
        uid: 'admin-uid-' + Date.now(),
        email: 'business@prozesy.com',
        password: cryptr.encrypt('ProKash@2.0'),
        name: 'Admin',
        purchaseCode: 'test'
      });
      
      await newAdmin.save();
      console.log('✅ New admin created');
    }
    
    console.log('\n📋 Admin Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Email: business@prozesy.com');
    console.log('Password: ProKash@2.0');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    await mongoose.disconnect();
    console.log('\n✅ Done!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdmin();
