const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

router.post("/register", (req, res, next) => {
  try {
    authController.userRegistration(req.body);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const data = await authController.userLogin(req.body);
    res.status(200).json({ token: data, message: "User login successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
