const express = require("express");
const route = express.Router();

console.log("✅ admin-clean.route.js loaded");

// PLACEHOLDER - Just one route to test
route.get("/placeholder", (req, res) => {
  res.json({ message: "Admin route loaded!" });
});

module.exports = route;
