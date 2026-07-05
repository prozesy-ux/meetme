require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const firebaseAdmin = require("firebase-admin");

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Firebase Admin
try {
  if (!firebaseAdmin.apps.length) {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
      : undefined;

    if (privateKey && process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL) {
      firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        }),
      });
      console.log("✅ Firebase initialized");
    } else {
      console.warn("⚠️ Firebase credentials missing - skipping initialization");
    }
  }
} catch (error) {
  console.error("Firebase initialization error:", error.message);
}

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URL;
if (mongoURI) {
  mongoose
    .connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("✅ MongoDB connected successfully");
      // Load settings into global
      require("./util/loadSettings")();
    })
    .catch((err) => console.error("❌ MongoDB connection error:", err));
} else {
  console.warn("⚠️ MONGODB_URI not configured - database will not connect");
}

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    status: "online",
    message: "Figgy Backend API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Initialize global settingJSON before loading routes
global.settingJSON = {
  tkpayEnabled: process.env.TKPAY_ENABLED === "true" || false,
  tkpayMerchantId: process.env.TKPAY_MERCHANT_ID || "",
  tkpayHashKey: process.env.TKPAY_HASH_KEY || "",
  tkpayApiUrl: process.env.TKPAY_API_URL || "https://tkm.worldxxpp.com",
  tkpayCallbackBaseUrl: process.env.TKPAY_CALLBACK_URL || "",
  tkpayIsTest: process.env.TKPAY_IS_TEST !== "false",
  secretKey: process.env.secretKey || "",
};

// Load routes
try {
  const allRoutes = require("./routes/route");
  app.use("/api", allRoutes);
  console.log("✅ Routes loaded successfully");
} catch (error) {
  console.error("Error loading routes:", error.message);
  console.error(error.stack);
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: "The requested endpoint does not exist",
    path: req.path,
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message,
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Figgy Backend running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});

module.exports = app;
