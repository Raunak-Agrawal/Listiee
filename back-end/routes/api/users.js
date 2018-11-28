const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
var nodemailer = require("nodemailer");

// Load Input Validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
const User = require("../../models/User");

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Users Works" }));

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post("/register", (req, res, next) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ "local.email": req.body.email })
    .then(user => {
      if (user) {
        errors.email = "Email already exists";
        return res.status(400).json(errors);
      } else {
        const avatar = gravatar.url(req.body.email, {
          s: "200", // Size
          r: "pg", // Rating
          d: "mm" // Default
        });

        const newUser = new User({
          method: "local",
          name: req.body.name,
          "local.email": req.body.email,
          avatar,
          "local.password": req.body.password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.local.password, salt, (err, hash) => {
            const payload = { newUser }; // Create JWT Payload

            // Sign Token
            jwt.sign(
              payload,
              keys.secretOrKey,
              { expiresIn: 3600 },
              (err, secretToken) => {
                newUser.secretToken = secretToken;
                newUser.active = false;
              }
            );
            newUser.local.password = hash;

            newUser
              .save()
              .then(user => {
                mailer(newUser);
                return res.json(user);
              })
              .catch(err => console.log(err));
          });
        });
      }
    })
    .catch(err => console.log(err));
});
const mailer = newUser => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "raunk325@gmail.com",
      pass: "r@un@k4321"
    }
  });

  const mailOptions = {
    from: "raunk325@email.com", // sender address
    to: newUser.local.email, // list of receivers
    subject: "Verify", // Subject line
    html: `<p>enter the token below at the below link</p><br><p>${
      newUser.secretToken
    }</p><br><p>http://localhost:3000/verify</p>` // plain text body
  };
  transporter.sendMail(mailOptions, function(err, info) {
    if (err) console.log(err);
    else console.log(info);
  });
};

// @route   GET api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public

router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ "local.email": email }).then(user => {
    // Check for user
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }

    // Check Password
    bcrypt.compare(password, user.local.password).then(isMatch => {
      if (!isValid) {
        errors.email = "User not found";
        return res.status(400).json(errors);
      }
      if (!user.active) {
        errors.email = "You Need to verify email first";
        return res.status(400).json(errors);
      }
      if (isMatch) {
        // User Matched
        const payload = {
          id: user.id,
          name: user.name,
          avatar: user.avatar
        }; // Create JWT Payload

        // Sign Token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        errors.password = "Password incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

router.post("/verify", (req, res) => {
  // const { errors } = validateLoginInput(req.body);
  // const { secretToken } = req.body;
  User.findOne({ secretToken: req.body.secretToken }).then(user => {
    console.log(user);
    if (!user) {
      console.log("not found");
    } else {
      console.log("token matched");
      user.active = true;
      user.secretToken = "";
      user
        .save()
        .then(user => res.json(user))
        .catch(err => console.log(err));
    }
  });
});

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);
signToken = user => {
  return jwt.sign(
    {
      iss: "Listiee",
      sub: user.id,
      iat: new Date().getTime(), // current time
      exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead
    },
    "helloworld"
  );
};
router.post(
  "/outh/google",
  passport.authenticate("googleToken", { session: false }),
  (req, res) => {
    var token = signToken(req.user);
    res.json({
      token
    });
  }
);
router.post(
  "/outh/facebook",
  passport.authenticate("facebookToken", { session: false }),
  (req, res) => {
    var token = signToken(req.user);
    res.json({
      token
    });
  }
);

module.exports = router;
