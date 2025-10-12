const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userController = {
  // Signup
  async signUp(req, res) {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) throw new Error("All fields are required");

      const existingUser = await userModel.findOne({ email });
      if (existingUser) throw new Error("User already exists");

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new userModel({
        name,
        email,
        password: hashedPassword,
        role: "GENERAL",
      });

      const savedUser = await newUser.save();
      res.status(200).json({
        message: "User created successfully",
        success: true,
        data: savedUser,
      });
    } catch (err) {
      res.status(500).json({ message: err.message, success: false });
    }
  },

  // Signin
  async signIn(req, res) {
    try {
      const { email, password } = req.body;
      const user = await userModel.findOne({ email });
      if (!user) throw new Error("User not registered");

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) throw new Error("Invalid password");

      const token = jwt.sign(
        { _id: user._id, email: user.email },
        process.env.TOKEN_SECRET_KEY,
        { expiresIn: "8h" }
      );

      res.cookie("token", token, { httpOnly: true, secure: true });
      res.json({ data: user, message: "Login successful", success: true, token });
    } catch (err) {
      res.status(500).json({ message: err.message, success: false });
    }
  },

  // Logout
  async logout(req, res) {
    try {
      res.clearCookie("token");
      res.json({ message: "Logged out successfully", success: true });
    } catch (err) {
      res.json({ message: err.message, success: false });
    }
  },

  // Get logged-in user details
  async getUserDetails(req, res) {
    try {
      const user = await userModel.findById(req.userId);
      if (!user) throw new Error("User not found");
      res.json({ message: "User details", success: true, data: user });
    } catch (err) {
      res.status(400).json({ message: err.message, success: false });
    }
  },

  // Update user
  async updateUser(req, res) {
    try {
      const { userId, email, name, role } = req.body;
      await userModel.findByIdAndUpdate(userId, { email, name, role });
      res.json({ message: "User updated", success: true });
    } catch (err) {
      res.status(400).json({ message: err.message, success: false });
    }
  },

  // Get all users
  async getAllUsers(req, res) {
    try {
      const users = await userModel.find();
      res.json({ message: "All users", success: true, data: users });
    } catch (err) {
      res.status(400).json({ message: err.message, success: false });
    }
  },

  // ✅ Activate user
async activateUser (req, res) {
  try {
    const user = await userModel.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    );
    res.json({ message: "User activated", data: user });
  } catch (err) {
    res.status(500).json({ error: "Failed to activate user" });
  }
},

// ✅ Deactivate user
async deactivateUser(req, res){
  try {
    const user = await userModel.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    res.json({ message: "User deactivated", data: user });
  } catch (err) {
    res.status(500).json({ error: "Failed to deactivate user" });
  }
},

// ✅ Delete user
async deleteUser(req, res){
  try {
    await userModel.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
},
};

module.exports = userController;
