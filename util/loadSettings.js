const mongoose = require("mongoose");

module.exports = async function loadSettings() {
  try {
    // Try to load from database if it exists
    const settingSchema = mongoose.connection.collection("settings");
    const settings = await settingSchema.findOne({});

    if (settings) {
      global.settingJSON = settings;
      console.log("✅ Settings loaded from database");
    } else {
      // Initialize with defaults
      global.settingJSON = {
        tkpayEnabled: process.env.TKPAY_ENABLED === "true" || false,
        tkpayMerchantId: process.env.TKPAY_MERCHANT_ID,
        tkpayHashKey: process.env.TKPAY_HASH_KEY,
        tkpayApiUrl: process.env.TKPAY_API_URL || "https://tkm.worldxxpp.com",
        tkpayCallbackBaseUrl:
          process.env.TKPAY_CALLBACK_URL || "https://betnzy.com",
        tkpayIsTest: process.env.TKPAY_IS_TEST === "true" || true,
      };
      console.log("⚠️ Using environment settings (database empty)");
    }
  } catch (error) {
    console.error("Error loading settings:", error.message);
    // Fallback to env vars
    global.settingJSON = {
      tkpayEnabled: process.env.TKPAY_ENABLED === "true" || false,
      tkpayMerchantId: process.env.TKPAY_MERCHANT_ID,
      tkpayHashKey: process.env.TKPAY_HASH_KEY,
      tkpayApiUrl: process.env.TKPAY_API_URL || "https://tkm.worldxxpp.com",
      tkpayCallbackBaseUrl:
        process.env.TKPAY_CALLBACK_URL || "https://betnzy.com",
      tkpayIsTest: process.env.TKPAY_IS_TEST === "true" || true,
    };
  }
};
