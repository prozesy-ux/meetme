const express  = require("express");
const route    = express.Router();

const validateUserToken  = require("../../middleware/validateUserToken.middleware");
const checkAccess        = require("../../checkAccess");
const tkpay              = require("../../controllers/client/tkpay.controller");

// Create a TKPAY payment order (bKash / Nagad / Rocket)
// Called by the Flutter app — requires user auth + API key
route.post("/createOrder", checkAccess(), validateUserToken, tkpay.createOrder);

// Callback from TKPAY server — no user auth, verified by EncryptValue signature
route.post("/callback", tkpay.callback);

// Verify payment status — allows app to check if payment was processed
// Called by the Flutter app during polling — requires user auth + API key
route.get("/verify/:shopOrderId", checkAccess(), validateUserToken, tkpay.verify);

module.exports = route;
