const express = require("express");
const route = express.Router();

// Simple test endpoint
route.get("/test", (req, res) => {
  res.json({ message: "Test route works!" });
});

module.exports = route;
