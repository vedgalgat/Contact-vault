const UserModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const sendMail = require("../controllers/mail.controller")


async function registerUser(req, res) {
  try {
    const { name, password, email } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const userExists = await UserModel.findOne({
      $or: [{ email }, { name }],
    });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });

    // 🔐 JWT SAFE CHECK
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET missing");
    }

    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
    });

    // ✅ RESPONSE FIRST
    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
      token,
    });

    // 📧 MAIL (NON BLOCKING)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      sendMail(email, name).catch(err =>
        console.error("Mail error:", err.message)
      );
    }

  } catch (error) {
    console.error("REGISTER ERROR 👉", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function loginUser(req, res) {
  const { password, email } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  if (!user.password) {
    return res.status(500).json({ message: "Password missing in DB" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax"
  });

  return res.status(200).json({
    message: "User logged in successfully",
    token,   // ✅ VERY IMPORTANT
    user
  });
}

module.exports = { registerUser, loginUser }