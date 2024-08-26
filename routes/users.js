var express = require("express");
var router = express.Router();

const User = require("../models/users");
const { checkBody } = require("../modules/checkBody");
const { checkRegime } = require("../modules/checkRegime");

// UID2
const uid2 = require("uid2");
const token = uid2(32);

// BCrypt
const bcrypt = require("bcrypt");
const hash = bcrypt.hashSync("password", 10);

// ALL Routes available here:
// Signin
// Signup
// Update (regime)

// Sign In for the user
// ${URL}/users/signin
router.post("/signin", (req, res) => {
  if (!checkBody(req.body, ["signin", "password"])) {
    res.json({ result: false, error: "Champs manquants ou vides" });
    return;
  }

  // We are looking to find a match for username or email in the database
  User.findOne({
    $or: [{ username: req.body.signin.toLowerCase() }, { email: req.body.signin.toLowerCase() }],
  }).then((data) => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, token: data.token, regime: data.regime });
    } else {
      res.json({ result: false, error: "Utilisateur inexistant ou mot de passe erroné" });
    }
  });
});

// Sign Up for the user
// ${URL}/users/signup
router.post("/signup", (req, res) => {
  // We check if username / email / password is empty
  if (!checkBody(req.body, ["username", "email", "password"])) {
    res.json({ result: false, error: "Champs manquants ou vides" });
    return;
  }

  // We check if regime is matching our values (on a string or an object)
  if (!checkRegime(req.body.regime)) {
    res.json({ result: false, error: "Champs régime inconnu" });
    return;
  }

  // Check if the username and email has not already been registered
  User.findOne({
    $or: [{ username: req.body.username.toLowerCase() }, { email: req.body.email.toLowerCase() }],
  }).then((data) => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        username: req.body.username.toLowerCase(),
        email: req.body.email.toLowerCase(),
        password: hash,
        token: uid2(32),
        regime: req.body.regime,
        signup_date: Date.now(),
        menus: [],
      });

      newUser.save().then((newDoc) => {
        // User added in the database
        res.json({ result: true, token: newDoc.token, regime: newDoc.regime });
      });
    } else {
      // User already exists in database
      res.json({ result: false, error: "Utilisateur déjà existant" });
    }
  });
});

// Updating regime user
// ${URL}/users/update
router.post("/update", (req, res) => {
  if (!checkBody(req.body, ["token"])) {
    res.json({ result: false, error: "Champs manquants ou vide" });
    return;
  }
  // We check if regime is matching our values (on a string or an object)
  if (!checkRegime(req.body.regime)) {
    res.json({ result: false, error: "Champs régime inconnu" });
    return;
  }
  // We check if the user has a token to modify regime
  User.findOne({ token: req.body.token }).then((data) => {
    if (data) {
      User.updateOne(
        { token: req.body.token },
        { regime: req.body.regime }
      ).then((result) => {
        result.modifiedCount >= 1
          ? res.json({ result: true })
          : res.json({
              result: false,
              error: "Régime non présent en base de données",
              data,
            });
      });
    } else {
      res.json({ result: false, error: "Utilisateur inexistant" });
    }
  });
});

module.exports = router;
