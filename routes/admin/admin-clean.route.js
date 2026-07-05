const express = require("express");
const route = express.Router();
const checkAccessWithSecretKey = require("../../checkAccess");
const validateAdminToken = require("../../middleware/verifyAdminAuthToken.middleware");
const adminLoginController = require("../../controllers/admin/admin-login-fixed");
const AdminController = require("../../controllers/admin/admin.controller");
const multer = require("multer");
const storage = require("../../util/multer");
const upload = multer({ storage: storage });

// CLEAN LOGIN - MOST IMPORTANT
route.post("/validateAdminLogin", checkAccessWithSecretKey(), adminLoginController.validateAdminLogin);

// Original admin endpoints
route.post("/registerAdmin", checkAccessWithSecretKey(), AdminController.registerAdmin);
route.get("/retrieveAdminProfile", checkAccessWithSecretKey(), validateAdminToken, AdminController.adminProfileGet);
route.patch("/modifyAdminProfile", checkAccessWithSecretKey(), validateAdminToken, upload.single("image"), AdminController.modifyAdminProfile);
route.patch("/modifyPassword", checkAccessWithSecretKey(), validateAdminToken, AdminController.updateAdminPassword);
route.patch("/performPasswordReset", checkAccessWithSecretKey(), validateAdminToken, AdminController.performPasswordReset);

module.exports = route;
