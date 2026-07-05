const crypto   = require("crypto");
const axios    = require("axios");

const User          = require("../../models/user.model");
const History       = require("../../models/history.model");
const TkpayPending  = require("../../models/tkpayPending.model");
const CoinPlan      = require("../../models/coinPlan.model");
const VipPlan       = require("../../models/vipPlan.model");

const generateHistoryUniqueId = require("../../util/generateHistoryUniqueId");

// Bangladesh channel IDs (WorldPay / TKPAY)
const CHANNEL = { bKash: 34, Nagad: 35, Rocket: 46 };
const CHANNEL_NAMES = { 34: "bKash", 35: "Nagad", 46: "Rocket" };
const CURRENCY_BDT  = 11;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Build EncryptValue as per TKPAY spec:
 *  1. Sort params A→Z (exclude EncryptValue + null values)
 *  2. Append &HashKey=<key>
 *  3. Lowercase the whole string
 *  4. SHA256
 *  5. UPPERCASE result
 */
function buildEncryptValue(params, hashKey) {
  const sorted = Object.keys(params)
    .filter((k) => k !== "EncryptValue" && params[k] !== null && params[k] !== undefined && params[k] !== "")
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");

  const raw   = `${sorted}&HashKey=${hashKey}`.toLowerCase();
  const hash  = crypto.createHash("sha256").update(raw).digest("hex");
  return hash.toUpperCase();
}

// ---------------------------------------------------------------------------
// POST /api/client/tkpay/createOrder
// ---------------------------------------------------------------------------
exports.createOrder = async (req, res) => {
  try {
    const userId   = req.user?.userId;
    const { channelId, coinPlanId, isVip, payerName } = req.body;

    if (!userId || !channelId || !coinPlanId) {
      return res.status(200).json({ status: false, message: "Missing required fields." });
    }

    const ch = Number(channelId);
    if (![CHANNEL.bKash, CHANNEL.Nagad, CHANNEL.Rocket].includes(ch)) {
      return res.status(200).json({ status: false, message: "Invalid payment channel." });
    }

    // ---- load plan ----
    let amount, bonusCoins, planVip = (isVip === true || isVip === "true");

    if (planVip) {
      const plan = await VipPlan.findById(coinPlanId).select("price coin").lean();
      if (!plan) return res.status(200).json({ status: false, message: "VIP plan not found." });
      amount     = plan.price;
      bonusCoins = plan.coin;
    } else {
      const plan = await CoinPlan.findById(coinPlanId).select("price coin bonus").lean();
      if (!plan) return res.status(200).json({ status: false, message: "Coin plan not found." });
      amount     = plan.price;
      bonusCoins = (plan.coin || 0) + (plan.bonus || 0);
    }

    // ---- setting check ----
    const s = global.settingJSON || {};
    if (!s.tkpayEnabled) {
      return res.status(200).json({ status: false, message: "TKPAY gateway is disabled." });
    }
    if (!s.tkpayMerchantId || !s.tkpayHashKey) {
      return res.status(200).json({ status: false, message: "TKPAY is not configured. Please contact support." });
    }

    const apiBase       = (s.tkpayApiUrl || "https://tkm.worldxxpp.com").replace(/\/$/, "");
    const callbackBase  = (s.tkpayCallbackBaseUrl || process.env.baseURL || "").replace(/\/$/, "");
    const shopOrderId   = await generateHistoryUniqueId();

    const params = {
      Amount:           amount,
      CurrencyId:       CURRENCY_BDT,
      IsTest:           s.tkpayIsTest === true ? true : false,
      PayerKey:         userId,
      PayerName:        payerName || "",
      PaymentChannelId: ch,
      ShopInformUrl:    `${callbackBase}/api/client/tkpay/callback`,
      ShopOrderId:      shopOrderId,
      ShopReturnUrl:    `${callbackBase}/payment/success`,
      ShopUserLongId:   s.tkpayMerchantId,
    };

    params.EncryptValue = buildEncryptValue(params, s.tkpayHashKey);

    const response = await axios.post(`${apiBase}/api/createOrder`, params, {
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      timeout: 15000,
    });

    const payUrl = response.data?.PayUrl || response.data?.payUrl || response.data?.data?.PayUrl;

    if (!payUrl) {
      console.error("[TKPAY] No PayUrl in response:", response.data);
      return res.status(200).json({ status: false, message: "Payment gateway error. Please try again." });
    }

    // ---- persist pending order ----
    await TkpayPending.create({
      shopOrderId,
      userId,
      coinPlanId:  planVip ? null : coinPlanId,
      vipPlanId:   planVip ? coinPlanId : null,
      isVip:       planVip,
      bonusCoins,
      amount,
      gateway:    CHANNEL_NAMES[ch] || "TKPAY",
      channelId:  ch,
      processed:  false,
    });

    return res.status(200).json({
      status:      true,
      message:     "Payment order created successfully.",
      payUrl,
      shopOrderId,
    });
  } catch (error) {
    const errData = error?.response?.data;
    console.error("[TKPAY] createOrder error:", errData || error.message);
    return res.status(500).json({ status: false, message: "Failed to create payment order." });
  }
};

// ---------------------------------------------------------------------------
// POST /api/client/tkpay/callback   (called by TKPAY server)
// ---------------------------------------------------------------------------
exports.callback = async (req, res) => {
  try {
    console.log("[TKPAY Callback] Received:", JSON.stringify(req.body));

    const body = req.body || {};
    const {
      OrderStatusId,
      Amount,
      ShopOrderId,
      ShopUserLongId,
      EncryptValue,
      OriginalOrderTrackingNumber,
    } = body;

    const s = global.settingJSON || {};

    // ---- verify merchant ----
    if (ShopUserLongId !== s.tkpayMerchantId) {
      console.warn("[TKPAY Callback] Merchant ID mismatch");
      return res.status(200).send("ok");
    }

    // ---- verify signature ----
    const paramsForVerify = { ...body };
    delete paramsForVerify.EncryptValue;
    const expected = buildEncryptValue(paramsForVerify, s.tkpayHashKey);
    if (expected !== EncryptValue) {
      console.warn("[TKPAY Callback] EncryptValue mismatch. Expected:", expected, "Got:", EncryptValue);
      return res.status(200).send("ok");
    }

    // ---- ignore supplement orders (repeat payments) unless you support them ----
    if (OriginalOrderTrackingNumber) {
      console.log("[TKPAY Callback] Supplement order — ignoring.");
      return res.status(200).send("ok");
    }

    // ---- only process success ----
    if (Number(OrderStatusId) !== 2) {
      console.log("[TKPAY Callback] Non-success status:", OrderStatusId);
      return res.status(200).send("ok");
    }

    // ---- find pending record ----
    const pending = await TkpayPending.findOne({ shopOrderId: ShopOrderId });
    if (!pending) {
      console.warn("[TKPAY Callback] Pending order not found:", ShopOrderId);
      return res.status(200).send("ok");
    }

    if (pending.processed) {
      console.log("[TKPAY Callback] Already processed:", ShopOrderId);
      return res.status(200).send("ok");
    }

    // ---- mark processed first (idempotency guard) ----
    const updated = await TkpayPending.updateOne(
      { _id: pending._id, processed: false },
      { $set: { processed: true } }
    );
    if (updated.modifiedCount === 0) {
      console.log("[TKPAY Callback] Race condition — already processed:", ShopOrderId);
      return res.status(200).send("ok");
    }

    // ---- credit coins to user ----
    const user = await User.findById(pending.userId).select("_id coin fcmToken").lean();
    if (!user) {
      console.error("[TKPAY Callback] User not found:", pending.userId);
      return res.status(200).send("ok");
    }

    const uniqueId = await generateHistoryUniqueId();
    const histType = pending.isVip ? 8 : 7; // 7=COIN_PLAN_PURCHASE, 8=VIP_PLAN_PURCHASE

    await Promise.all([
      User.updateOne(
        { _id: user._id },
        { $inc: { coin: pending.bonusCoins, rechargedCoins: pending.bonusCoins } }
      ),
      History.create({
        uniqueId,
        type:           histType,
        userId:         user._id,
        bonusCoins:     pending.bonusCoins,
        price:          Amount || pending.amount,
        paymentGateway: pending.gateway,
        date:           new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
      }),
    ]);

    console.log(`[TKPAY Callback] ✅ Credited ${pending.bonusCoins} coins → user ${user._id} via ${pending.gateway}`);

    // ---- send FCM notification ----
    if (user.fcmToken) {
      try {
        const adminFirebase = require("../../util/privateKey");
        const adminInstance = await adminFirebase;
        await adminInstance.messaging().send({
          token: user.fcmToken,
          data: {
            title: `💰 Payment Successful via ${pending.gateway}!`,
            body:  `${pending.bonusCoins} coins have been credited to your wallet.`,
            type:  "PAYMENT_SUCCESS",
          },
        });
      } catch (fcmErr) {
        console.error("[TKPAY Callback] FCM error:", fcmErr.message);
      }
    }

    return res.status(200).send("ok");
  } catch (error) {
    console.error("[TKPAY Callback] Error:", error);
    return res.status(200).send("ok"); // Always return ok to avoid TKPAY retry spam
  }
};

// ---------------------------------------------------------------------------
// GET /api/client/tkpay/verify/:shopOrderId
// Allows app to check if payment was successfully processed
// ---------------------------------------------------------------------------
exports.verify = async (req, res) => {
  try {
    const { shopOrderId } = req.params;
    
    if (!shopOrderId) {
      return res.status(200).json({ status: false, message: "shopOrderId is required." });
    }

    // Find the pending order
    const pending = await TkpayPending.findOne({ shopOrderId });
    
    if (!pending) {
      return res.status(200).json({
        status:    false,
        processed: false,
        message:   "Order not found or expired."
      });
    }

    // Check if payment was processed
    if (pending.processed === true) {
      return res.status(200).json({
        status:    true,
        processed: true,
        message:   "Payment verified successfully!",
        bonusCoins: pending.bonusCoins,
        gateway:   pending.gateway,
      });
    } else {
      return res.status(200).json({
        status:    true,
        processed: false,
        message:   "Payment is pending verification...",
      });
    }
  } catch (error) {
    console.error("[TKPAY Verify] Error:", error);
    return res.status(500).json({ status: false, message: "Verification failed." });
  }
};
