const express = require("express");
const route = express.Router();

const LoginController = require("../../controllers/admin/login.controller");

//get login or not
route.get("/", LoginController.get);

// POST login with email and password
route.post("/", LoginController.post);

module.exports = route;
