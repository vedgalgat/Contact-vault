const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

async function authenticateUser(req, res, next) {
  try {
    // 🔥 TOKEN HEADER SE NIKALO
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized please Login first" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await UserModel.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // ✅ RIGHT WAY
    req.user = user;

    next(); // 🔥 NO RESPONSE HERE
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Invalid token please Login first" });
  }
}

module.exports = authenticateUser;
