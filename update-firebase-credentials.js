const mongoose = require('mongoose');

// Firebase service account credentials for meetme-9ff7c
const firebaseCredentials = {
  "type": "service_account",
  "project_id": "meetme-9ff7c",
  "private_key_id": "f5b7d0d87be58c659848e8fead6266bc5ab4a68f",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDRY1h3nVAGSAj8\nkdk5hHun2EdpKOhK2rvsJA/f5cvHBIn4sWsgu+vxACYnKBGGgoHjLTYTDoWus9IH\nafO2m16DXZCzKPazB2ShwMR1HzC8PiTLBH3M60crCszCsk5rYVrQWYF1so8bjh+Z\n5get/RHZQRvZA4jymBN6kj+CNth87EkeTqNSfnUJG+GlFJ1W2UJZV00ei3LFH05e\nVzOwPg44HwyQz1lPzvhqyYMD7kmtVlkwCYhraGd3tjtTlgXX7F66GwtfhVLgKi0G\nLZnXS0Lx2os1rXN/l6n0wGERpA8hF4dcDU5j0u3P/xkGXe8W0/GSDqoCwjIDICvE\nusqzKy2lAgMBAAECggEAB49yZ/c/0XTpENLkqLAA6wGN1TKLQ1CnN7027tr+7Z5b\nVlB0UXKXmqm/turlHxnik2T+2SyiumPMce9rGQJ+eiMhu2ZU6gfv+UCFl25bNct5\n9p6gkDVFP5JHQcHAanN8ckjDujqKnPBtHFhy7zRTtaglLO50vmsBS7awy68r8plg\nt9dAokDWVno4mOtvmfXVmqhep1hQouzbn6URkzkzW5dN+33QpMFUI/ubI2NchxIJ\nKStH/tO6Gv39lK4JokGTbedRA2WMgVLTMUyUmHznWH8N+jSmU6XfagaARqYEAENn\nHvZ+0KqsZo0mn3Yp2zSX0OKLnifbzgr9Rq2qEA0aoQKBgQD9MMkw4h6iKFf3OZNI\nIfWsW3g8EAjbWdbBjIQYa0fPbw49YqVOq0zZtP0vez2Bdd+/gDcbPDt41KBrrS5t\nUaS9gcwm/lrhvwQqbr3Iw6m/MJ2F65cS2kD1L+Q9JbKT5mC2KCos0Ia/LPjivHYZ\n/COIDnYNQQxaOwA2B88vketeeQKBgQDTtiJVwGEzxuvBZyNfXn4n/LhgBqbxgrS2\nBP42UeVp7/n02br1Mk4FwgzmMkT3sumltYtCcJW75JkxaYCNbAEgrmaX7KBo0Cem\nMFNgKTa4ACiFyL1Ixu0ly+aseFW75LM0ntnQtUll7kLGwbBMrhh7rGDqSPYSko9R\nscinh5wNjQKBgEYif3jFCktM9aEMF9pBXfZSmCm7H1jzt+OBcw34mbnCP6WNb9Es\n7mrYEdJXRyBXcJVxhNJMiwTbkVyCanvpw8Ki89RRXQdvjE3cw0GbwaeuZdQ1AHI+\ndwP0Mjsl+CO0C1IqKhSj5s+KO59DKUvlZkpIBzeAr1VHRrWw0BmTSCmxAoGBAMJ4\ng4GRfbg5+UVmoC9ydR/2HMbYVXFzRtwMKhdrkviE323ysrGYy+KuJXsuofuF9Omq\noYkeMeyuR6oD53oAw+hpSwQy8AZXbpRRv8SNFx5dxttdUcIQOLaHXhT/VIGLyrGD\nWUFFxW5ENkKsmG1XXlX8Oen7q03UIqJAVLjO8KHhAoGBALx9yiTM6hJXAuGTt5m1\nNQy9PmrZWAPGmEH1eznCaFI8rQT51LrLoCmyjqhgtnkJXX5IVtmTD1iYoICuyr1g\n+27uRjGKBaluTtnx2VW1jyBgUUyjuXXmocJYXT7y7vXI0Qvrupe9zgssr1ck5b1g\nd0Fmv+xVJg4ozS0p0rDl1tgA\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@meetme-9ff7c.iam.gserviceaccount.com",
  "client_id": "102575459862864809506",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40meetme-9ff7c.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

const mongoUri = "mongodb://D1I6BWmE6o:NloHfno9Iv@159.223.48.76:27017/figgy?authSource=admin";

async function updateSettings() {
  try {
    console.log("📡 Connecting to MongoDB...");
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    const db = mongoose.connection.db;
    const settingsCollection = db.collection("settings");

    // Update or create setting with new Firebase credentials
    const result = await settingsCollection.updateOne(
      {}, // Match any existing setting (first document)
      {
        $set: {
          privateKey: firebaseCredentials,
          secretKey: "meetme_secret_key_2024",
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    console.log("\n✅ Settings updated successfully!");
    console.log(`📊 Matched documents: ${result.matchedCount}`);
    console.log(`📝 Modified documents: ${result.modifiedCount}`);
    console.log(`➕ Upserted documents: ${result.upsertedCount}`);
    console.log("\n🔑 Firebase Project: meetme-9ff7c");
    console.log("🔐 Secret Key: meetme_secret_key_2024");
    console.log("\n✨ Backend is now configured to use the new Firebase project!");
    console.log("⏭️  Please restart the Railway backend to load the new credentials.");

  } catch (error) {
    console.error("❌ Error updating settings:", error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("\n👋 Disconnected from MongoDB");
  }
}

updateSettings();
