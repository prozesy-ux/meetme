module.exports = () => {
  return (req, res, next) => {
    const key = req.headers.key || req.body.key || req.query.key;
    const secretKey = process.env.secretKey || "mysecretkey123"; // Default if not set

    if (key) {
      if (key === secretKey) {
        next();
      } else {
        return res.status(400).json({ status: false, error: "Unpermitted infiltration" });
      }
    } else {
      return res.status(400).json({ status: false, error: "Unpermitted infiltration" });
    }
  };
};
