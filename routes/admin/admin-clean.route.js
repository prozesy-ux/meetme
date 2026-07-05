const express = require("express");
const route = express.Router();

console.log("✅ admin-clean.route.js loaded");

// TEST ROUTE WITHOUT MIDDLEWARE
route.post("/validateAdminLogin", (req, res) => {
  res.json({ test: "Login endpoint works!" });
});

module.exports = route;
