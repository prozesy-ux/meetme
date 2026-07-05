const mongoose = require('mongoose');

const mongoURL = process.env.MONGODB_URI || process.env.MONGO_URL;
console.log('Connecting to MongoDB...');

mongoose.connect(mongoURL).then(() => {
  console.log('✅ MongoDB connected');
  
  const loginSchema = new mongoose.Schema({
    login: { type: Boolean, default: false }
  });
  const Login = mongoose.model('Login', loginSchema);
  
  // Update login status to true
  Login.updateOne({}, { $set: { login: true } }, { upsert: true }).then(() => {
    console.log('✅ Login status updated to true');
    process.exit(0);
  }).catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
}).catch(err => {
  console.error('❌ MongoDB Connection Error:', err);
  process.exit(1);
});
