const express = require("express");
const route = express.Router();
const checkAccessWithSecretKey = require("../../checkAccess");
const validateAdminToken = require("../../middleware/verifyAdminAuthToken.middleware");

// Import clean controllers
const adminLoginController = require("../../controllers/admin/admin-login-fixed");

// Try to import original AdminController (might be obfuscated)
let AdminController;
try {
  AdminController = require("../../controllers/admin/admin.controller");
} catch (err) {
  console.error("Warning: Could not load AdminController:", err.message);
  AdminController = {};
}

const multer = require("multer");
const storage = require("../../util/multer");
const upload = multer({ storage: storage });

// Login endpoint (clean version) - MOST IMPORTANT
route.post("/validateAdminLogin", checkAccessWithSecretKey(), adminLoginController.validateAdminLogin);

// Other admin endpoints from original controller (fallback if they exist)
if (AdminController.registerAdmin) {
  route.post("/registerAdmin", checkAccessWithSecretKey(), AdminController.registerAdmin);
}
if (AdminController.adminProfileGet) {
  route.get("/retrieveAdminProfile", checkAccessWithSecretKey(), validateAdminToken, AdminController.adminProfileGet);
}
if (AdminController.modifyAdminProfile) {
  route.patch("/modifyAdminProfile", checkAccessWithSecretKey(), validateAdminToken, upload.single("image"), AdminController.modifyAdminProfile);
}
if (AdminController.updateAdminPassword) {
  route.patch("/modifyPassword", checkAccessWithSecretKey(), validateAdminToken, AdminController.updateAdminPassword);
}
if (AdminController.performPasswordReset) {
  route.patch("/performPasswordReset", checkAccessWithSecretKey(), validateAdminToken, AdminController.performPasswordReset);
}

module.exports = route;
