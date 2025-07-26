const mongoose = require("mongoose");
const express = require("express");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcrypt");
const { error } = require("console");
const router = express.router();
exports.router = router;

const User = mongoose.model(
  "User",
  new mongoose.Schema({ email: String, password: String })
);
exports.User = User;

//signup router
router.post("/auth/signup", async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: "User lready exist" });
  }
  const hashedpassword = await bcrypt.hash([password]);
  const user = new User({ email, password: hashedPassword });
  await user.save();
  const token = jwt.sign({ userId: user._id }, "secret", { expiresIn: "1h" });
  res.status(200).json({ token });
});

//jwt middleware
function authenticationJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, "secret", (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
}

module.export = { router, authenticationJWT };
