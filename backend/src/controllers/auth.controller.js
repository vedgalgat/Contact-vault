const UserModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const sendMail = require("../controllers/mail.controller")

async function registerUser(req, res) {
  try {
    console.log("STEP 1: request aayi");

    const { name, email, password } = req.body;

    console.log("STEP 2: body mila", name, email);

    const user = await UserModel.create({
      name,
      email,
      password: "test123"
    });

    console.log("STEP 3: user created", user._id);

    return res.status(201).json({
      message: "TEST OK",
    });

  } catch (err) {
    console.error("❌ ERROR:", err);
    return res.status(500).json({ message: "ERROR" });
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