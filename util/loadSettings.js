const mongoose = require("mongoose");

module.exports = async function loadSettings() {
  try {
    const Setting = require("../models/setting.model");
    let settings = await Setting.findOne({});

    if (settings) {
      global.settingJSON = settings;
      console.log("✅ Settings loaded from database");
    } else {
      // Create a default Settings document in the database so registerAdmin can find it
      settings = new Setting({
        tkpayEnabled: process.env.TKPAY_ENABLED === "true" || false,
        tkpayMerchantId: process.env.TKPAY_MERCHANT_ID || "",
        tkpayHashKey: process.env.TKPAY_HASH_KEY || "",
        tkpayApiUrl: process.env.TKPAY_API_URL || "https://tkm.worldxxpp.com",
        tkpayCallbackBaseUrl: process.env.TKPAY_CALLBACK_URL || "https://betnzy.com",
        tkpayIsTest: process.env.TKPAY_IS_TEST === "true" || true,
        privateKey: {},
      });
      await settings.save();
      global.settingJSON = settings;
      console.log("✅ Default Settings document created in database");
    }
  } catch (error) {
    console.error("Error loading settings:", error.message);
    global.settingJSON = {
      tkpayEnabled: process.env.TKPAY_ENABLED === "true" || false,
      tkpayMerchantId: process.env.TKPAY_MERCHANT_ID || "",
      tkpayHashKey: process.env.TKPAY_HASH_KEY || "",
      tkpayApiUrl: process.env.TKPAY_API_URL || "https://tkm.worldxxpp.com",
      tkpayCallbackBaseUrl: process.env.TKPAY_CALLBACK_URL || "https://betnzy.com",
      tkpayIsTest: process.env.TKPAY_IS_TEST === "true" || true,
    };
  }
};
