    const UserModel = require("../models/user.model")
    const jwt = require("jsonwebtoken")
    const bcrypt = require("bcryptjs")
    const sendMail=require("../controllers/mail.controller")


    async function registerUser(req, res) {
        const { name, password, email } = req.body

        const userExists = await UserModel.findOne({
            $or:[{name},{email}]
        })

        if (userExists) {
            return res.status(400).json({ message: "User already exists" })
        }

        const newUser = await UserModel.create({
            name,
            password: await bcrypt.hash(password, 10),
            email
        })

        await sendMail(email,name)

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET)

        res.cookie("token", token)

        return res.status(201).json({ message: "User registered successfully", user: newUser, })
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