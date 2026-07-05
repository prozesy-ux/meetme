const express = require("express");
const route = express.Router();

console.log("✅ admin-clean.route.js loaded");

// TEST - Verify routes are loading
route.get("/admin-test", (req, res) => {
  res.json({ message: "Admin routes are loading!" });
});

// LOGIN ENDPOINT
route.post("/validateAdminLogin", (req, res) => {
  res.json({ test: "Login endpoint works!" });
});

module.exports = route;
