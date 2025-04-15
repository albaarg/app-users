import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "10d" });
};

router.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 4) {
      return res
        .status(400)
        .json({ message: "Password must be at least 4 characters" });
    }
    if (username.length < 3) {
      return res
        .status(400)
        .json({ message: "Username must be at least 3 characters" });
    }

    //check if user exists

    const existsEmail = await User.findOne({ email });
    if (existsEmail)
      return res.status(400).json({ message: "Email already exists" });

    const existsUsername = await User.findOne({ username });
    if (existsUsername)
      return res.status(400).json({ message: "Username already exists" });

    const avatar = `https://api.dicebear.com/5.x/initials/png?seed=${encodeURIComponent(
      username
    )}`;

    const user = new User({
      email,
      username,
      password,
      profileImage: avatar,
      createdAt: new Date(),
    });

    await user.save();
    const token = generateToken(user._id);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Error in register", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    // ✅ Caso especial para admin predefinido
    if (email === "admin@example.com" && password === "123456") {
      const user = {
        id: "admin-id",
        username: "Admin",
        email: "admin@example.com",
        profileImage: `https://api.dicebear.com/5.x/initials/png?seed=Admin`,
        createdAt: new Date(),
      };

      const token = generateToken(user.id);
      return res.status(200).json({ token, user });
    }

    //check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    //check if password is correct
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    //generate token
    const token = generateToken(user._id);
    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Error in login", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
export default router;
