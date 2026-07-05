const express = require("express");
const route = express.Router();

const LoginController = require("../../controllers/admin/login.controller");

//get login or not
route.get("/", LoginController.get);

// TEMP: reset admin for re-signup
route.delete("/reset-admin-temp", LoginController.resetAdmin);

module.exports = route;
