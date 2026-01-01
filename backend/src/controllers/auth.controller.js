const UserModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const sendMail = require("../controllers/mail.controller")
async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;

    const exists = await UserModel.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      name,
      email,
      password: hashed
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax"
    });

    // 🔥 RESPONSE FIRST
    res.status(201).json({
      message: "Signup successful",
      token,
      user
    });

    // 🔥 EMAIL AFTER RESPONSE
    sendMail(email, name)
      .catch(err => console.log("Mail error:", err.message));

  } catch (err) {
    console.error("REGISTER ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
}
async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET missing");
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production"
    });

    return res.status(200).json({
      message: "User logged in successfully",
      token,
      user
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
}


module.exports = { registerUser, loginUser }