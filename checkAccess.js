module.exports = () => {
  return (req, res, next) => {
    const key = req.headers.key || req.body.key || req.query.key;
    const validKey = process.env?.secretKey || global.settingJSON?.secretKey || "meetme_secret_key_2024";

    if (key) {
      if (key === validKey) {
        next();
      } else {
        return res.status(400).json({ status: false, error: "Unpermitted infiltration" });
      }
    } else {
      return res.status(400).json({ status: false, error: "Unpermitted infiltration" });
    }
  };
};
