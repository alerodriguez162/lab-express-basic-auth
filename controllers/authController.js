const bcryptjs = require("bcryptjs");
const app = require("../app");
const saltRounds = 10;

const User = require("../models/User.model");

exports.createSignUpForm = async (req, res, next) => {
  res.render("auth/signup");
};

exports.submitSignUpForm = async (req, res, next) => {
  const { username, email, password } = req.body;
  const salt = await bcryptjs.genSalt(saltRounds);
  const hashedPassword = await bcryptjs.hash(password, salt);
  const newUser = await User.create({
    username,
    email,
    passwordHash: hashedPassword,
  });

  console.log(newUser);

  res.render("auth/login");
};

exports.createLoginForm = async (req, res, next) => {
  res.render("auth/login");
};

exports.submitLoginForm = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !username.length || !password || !password.length) {
    return res.render("auth/login", {
      errorMessage: "Tienes campos vacíos. Debes llenarlos.",
    });
  }
  try {
    const foundUser = await User.findOne({ username });

    if (!foundUser) throw new Error("El usuario o la contraseña son erróneas. Intenta nuevamente");

    const isItMatched = await bcryptjs.compareSync(password, foundUser.passwordHash);

    if (!isItMatched) throw new Error("La contraseña es incorrecta. Intenta nuevamente");

    req.session.currentUser = foundUser;

    res.redirect("/");
  } catch (error) {
    return res.render("auth/login", {
      errorMessage: error.message,
    });
  }
};
