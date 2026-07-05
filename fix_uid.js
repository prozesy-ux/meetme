const mongoose = require('mongoose');

async function updateAdminUID() {
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
    
    // Update the admin UID
    const result = await Admin.updateOne(
      { email: 'business@prozesy.com' },
      { uid: 'pzvkvAd5qNUuxw4fRlp3bwTXnVF3' }
    );
    
    if (result.modifiedCount > 0) {
      console.log('✅ Admin UID updated successfully!');
    } else {
      console.log('⚠️ No records updated');
    }
    
    // Verify
    const updated = await Admin.findOne({ email: 'business@prozesy.com' });
    console.log('\n✅ Updated Admin Record:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Email:', updated.email);
    console.log('UID:', updated.uid);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    await mongoose.disconnect();
    console.log('\n✅ Done!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updateAdminUID();
