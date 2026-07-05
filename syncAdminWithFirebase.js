const mongoose = require('mongoose');

async function syncAdmin() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(
      'mongodb+srv://admin:12345@cluster0.mongodb.net/meetme?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log('✅ MongoDB connected');

    const adminSchema = new mongoose.Schema(
      {
        uid: String,
        email: String,
        password: String,
        name: String,
        image: String,
        purchaseCode: String,
      },
      { collection: 'admins' }
    );

    const Admin = mongoose.model('Admin', adminSchema);

    // Find existing admin
    let admin = await Admin.findOne();
    
    if (admin) {
      console.log('📝 Updating existing admin...');
      await Admin.updateOne(
        { _id: admin._id },
        {
          uid: 'rYdvhXHfOJPKrfPJm4UwsjDT6573',
          email: 'business@prozesy.com',
          name: 'Admin'
        }
      );
      console.log('✅ Admin updated!');
    } else {
      console.log('📝 Creating new admin...');
      const newAdmin = new Admin({
        uid: 'rYdvhXHfOJPKrfPJm4UwsjDT6573',
        email: 'business@prozesy.com',
        name: 'Admin',
        purchaseCode: 'admin-' + Date.now()
      });
      await newAdmin.save();
      console.log('✅ Admin created!');
    }

    // Verify
    const updated = await Admin.findOne({ email: 'business@prozesy.com' });
    console.log('\n✅ SUCCESS! Admin synced with Firebase:');
    console.log('   Email:', updated.email);
    console.log('   UID:', updated.uid);
    console.log('   Name:', updated.name);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

syncAdmin();
