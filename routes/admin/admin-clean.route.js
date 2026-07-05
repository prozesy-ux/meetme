const express = require("express");
const route = express.Router();
const checkAccessWithSecretKey = require("../../checkAccess");
const adminLoginController = require("../../controllers/admin/admin-login-fixed");

console.log("✅ admin-clean.route.js loaded");

// LOGIN ENDPOINT - WORKING
route.post("/validateAdminLogin", checkAccessWithSecretKey(), adminLoginController.validateAdminLogin);

// Try to load other endpoints
try {
  const validateAdminToken = require("../../middleware/verifyAdminAuthToken.middleware");
  const AdminController = require("../../controllers/admin/admin.controller");
  const multer = require("multer");
  const storage = require("../../util/multer");
  const upload = multer({ storage: storage });

  route.post("/registerAdmin", checkAccessWithSecretKey(), AdminController.registerAdmin);
  route.get("/retrieveAdminProfile", checkAccessWithSecretKey(), validateAdminToken, AdminController.adminProfileGet);
  route.patch("/modifyAdminProfile", checkAccessWithSecretKey(), validateAdminToken, upload.single("image"), AdminController.modifyAdminProfile);
  route.patch("/modifyPassword", checkAccessWithSecretKey(), validateAdminToken, AdminController.updateAdminPassword);
  route.patch("/performPasswordReset", checkAccessWithSecretKey(), validateAdminToken, AdminController.performPasswordReset);
} catch (err) {
  console.log("⚠️ Optional admin routes failed:", err.message);
}

module.exports = route;
