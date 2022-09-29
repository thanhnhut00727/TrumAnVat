const express = require("express");
const router = express.Router();
const argon2 = require("argon2");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/auth");

// @router POST api/auth
// @desc veryfineToken
// access Public
router.get("/", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
// @router POST api/auth/register
// @desc Register User
// access Public
router.post("/register", async (req, res) => {
  const { userName, password } = req.body;
  //user validation
  if (!userName || !password)
    return res
      .status(400)
      .json({ status: false, message: "userName and/or Password is required" });
  try {
    // check for existing user
    const exitingUser = await User.findOne({ userName: userName });
    if (exitingUser)
      return res
        .status(400)
        .json({ status: false, message: "UserName existing" });
    //hash password
    const hashedPassword = await argon2.hash(password);
    const newUser = new User({
      userName,
      password: hashedPassword,
    });
    // save user to mongo
    await newUser.save();
    // return access token
    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.ACCESS_TOKEN_SERET
    );
    return res.json({
      status: true,
      message: "User created successfully",
      accessToken,
    });
  } catch (error) {
    console.log(error);
  }
});

// @router GET api/auth/login
// @desc Login to App
// access Public
// @route POST api/auth/login
// @desc Login user
// @access Public
router.post("/login", async (req, res) => {
  const { userName, password } = req.body;

  // Simple validation
  if (!userName || !password)
    return res
      .status(400)
      .json({ success: false, message: "Missing username and/or password" });

  try {
    // Check for existing user
    const user = await User.findOne({ userName });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Incorrect username or password" });

    // Username found
    const passwordValid = await argon2.verify(user.password, password);
    if (!passwordValid)
      return res
        .status(400)
        .json({ success: false, message: "Incorrect username or password" });

    // All good
    // Return token
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SERET
    );

    res.json({
      success: true,
      message: "User logged in successfully",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
// router.get("/login", async (req, res) => {
//   const { userName, password } = req.body;
// });
module.exports = router;
