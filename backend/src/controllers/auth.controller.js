const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const sendEmail = require("../utils/sendMail.utils.js");

/* ================= REGISTER ================= */
async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;

    // 1️⃣ Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2️⃣ Check existing user
    const exists = await UserModel.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Create user
    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });

    // 5️⃣ JWT
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET missing");
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 6️⃣ Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    // 7️⃣ RESPONSE IMMEDIATELY ✅
    res.status(201).json({
      message: "Signup successful",
      token,
      user,
    });
    // 8️⃣ SEND WELCOME EMAIL   

    await sendEmail({
      to: email,
      subject: "Welcome to Contact Vault 🎉",
      html: `
      <h2>Hello ${name} 👋</h2>
      <p>Your account has been created successfully.</p>
      <p>Start saving your contacts securely 🔐</p>
    `,
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
}

/* ================= LOGIN ================= */
async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    // 1️⃣ Validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // 2️⃣ Find user
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 3️⃣ Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 4️⃣ JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 5️⃣ Cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    // 6️⃣ Response
    return res.status(200).json({
      message: "User logged in successfully",
      token,
      user,
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = { registerUser, loginUser };
