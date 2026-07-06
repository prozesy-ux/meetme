const mongoose = require("mongoose");

// Stores a pending TKPAY order so the callback can credit the right user/plan
const tkpayPendingSchema = new mongoose.Schema(
  {
    shopOrderId: { type: String, unique: true, required: true }, // our unique order ID sent to TKPAY
    userId:      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    coinPlanId:  { type: mongoose.Schema.Types.ObjectId, default: null }, // null if VIP
    vipPlanId:   { type: mongoose.Schema.Types.ObjectId, default: null }, // null if Coin
    isVip:       { type: Boolean, default: false },
    bonusCoins:  { type: Number, default: 0 },   // coins to credit on success
    amount:      { type: Number, default: 0 },   // fiat amount charged
    gateway:     { type: String, default: "" },   // "bKash" | "Nagad" | "Rocket"
    channelId:   { type: Number, default: 0 },   // 34 | 35 | 46
    processed:   { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

tkpayPendingSchema.index({ shopOrderId: 1 });
tkpayPendingSchema.index({ processed: 1 });

module.exports = mongoose.model("TkpayPending", tkpayPendingSchema);
