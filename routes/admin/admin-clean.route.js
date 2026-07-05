const express = require("express");
const route = express.Router();
const checkAccessWithSecretKey = require("../../checkAccess");
const adminLoginController = require("../../controllers/admin/admin-login-fixed");

// SIMPLE - JUST THE LOGIN ENDPOINT FIRST
route.post("/validateAdminLogin", checkAccessWithSecretKey(), adminLoginController.validateAdminLogin);

// Try to load other endpoints, but don't fail if they can't
try {
  const validateAdminToken = require("../../middleware/verifyAdminAuthToken.middleware");
  const AdminController = require("../../controllers/admin/admin.controller");
  const multer = require("multer");
  const storage = require("../../util/multer");
  const upload = multer({ storage: storage });

  // Original admin endpoints (only if AdminController loads)
  route.post("/registerAdmin", checkAccessWithSecretKey(), AdminController.registerAdmin);
  route.get("/retrieveAdminProfile", checkAccessWithSecretKey(), validateAdminToken, AdminController.adminProfileGet);
  route.patch("/modifyAdminProfile", checkAccessWithSecretKey(), validateAdminToken, upload.single("image"), AdminController.modifyAdminProfile);
  route.patch("/modifyPassword", checkAccessWithSecretKey(), validateAdminToken, AdminController.updateAdminPassword);
  route.patch("/performPasswordReset", checkAccessWithSecretKey(), validateAdminToken, AdminController.performPasswordReset);
} catch (err) {
  console.log("⚠️ Other admin routes not available:", err.message);
  // Continue anyway - login endpoint is the critical one
}

module.exports = route;
