const express = require("express");
const route = express.Router();

console.log("✅ admin-clean.route.js loaded - VERSION 2");

// LOGIN ENDPOINT TEST
route.post("/validateAdminLogin", async (req, res) => {
  return res.json({ message: "LOGIN ENDPOINT VERSION 2 RUNNING" });
});

module.exports = route;
