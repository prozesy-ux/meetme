const mongoose = require('mongoose');
const Cryptr = require('cryptr');

const cryptr = new Cryptr('MyTotallySecretKey');

async function updateAdmin() {
  try {
    await mongoose.connect('mongodb+srv://admin:12345@cluster0.mongodb.net/meetme?retryWrites=true&w=majority');
    console.log('✅ Connected to MongoDB');
    
    const Admin = mongoose.model('Admin', new mongoose.Schema({
      uid: String,
      name: String,
      email: String,
      password: String,
      image: String,
      purchaseCode: String,
      createdAt: Date,
      updatedAt: Date
    }));
    
    // Find any existing admin
    const existingAdmin = await Admin.findOne();
    
    if (existingAdmin) {
      console.log('Found existing admin, updating...');
      console.log('Old email:', existingAdmin.email);
      
      // Update to match Firebase
      await Admin.updateOne(
        { _id: existingAdmin._id },
        {
          email: 'business@prozesy.com',
          password: cryptr.encrypt('ProKash@2.0')
        }
      );
      
      console.log('✅ Updated!');
    } else {
      // Create new admin
      console.log('No admin found, creating new...');
      const newAdmin = new Admin({
        uid: 'admin-uid-' + Date.now(),
        email: 'business@prozesy.com',
        password: cryptr.encrypt('ProKash@2.0'),
        name: 'Admin',
        purchaseCode: 'test'
      });
      
      await newAdmin.save();
      console.log('✅ Created!');
    }
    
    // Verify
    const updated = await Admin.findOne();
    console.log('\n✅ Database Updated:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Email:', updated.email);
    console.log('Password (encrypted):', updated.password);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📋 Use these to login:');
    console.log('Email: business@prozesy.com');
    console.log('Password: ProKash@2.0');
    
    await mongoose.disconnect();
    console.log('\n✅ Done!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updateAdmin();
