const express = require("express");
const router = express.Router();

const authController = require("./../controllers/authController");

router.get("/signup", authController.createSignUpForm);

router.post("/signup", authController.submitSignUpForm);

router.get("/login", authController.createLoginForm);

router.post("/login", authController.submitLoginForm);

module.exports = router;
