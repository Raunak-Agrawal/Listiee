const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const GooglePlusTokenStrategy = require("passport-google-plus-token");
const FacebookTokenStrategy = require("passport-facebook-token");
const mongoose = require("mongoose");
const User = mongoose.model("users");
const keys = require("../config/keys");
// const User = require("../../models/User");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      //   console.log(jwt_payload);
      User.findById(jwt_payload.id)
        .then(user => {
          if (user) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        })
        .catch(err => console.log(err));
    })
  );
  passport.use(
    "googleToken",
    new GooglePlusTokenStrategy(
      {
        clientID:
          "94519459508-v7poujk5af6jfviifs44uo74o2ne9gv2.apps.googleusercontent.com",
        clientSecret: "pVDRPp_BaAloW7PJRwz2VR4P"
      },
      (accessToken, refreshToken, profile, done) => {
        console.log("accessToken", accessToken);
        console.log("refreshToken", refreshToken);
        console.log("profile", profile);
        User.findOne({ "google.id": profile.id })
          .then(user => {
            if (user) {
              return done(null, user);
            }
            const newUser = new User({
              method: "google",
              google: {
                id: profile.id,
                email: profile.emails[0].value
              }
            });
            newUser
              .save()
              .then(user => console.log(user))
              .catch(err => console.log(err));
          })
          .catch(err => console.log(err.message));
      }
    )
  );
  passport.use(
    "facebookToken",
    new FacebookTokenStrategy(
      {
        clientID: "2055890568055031",
        clientSecret: "1653dbfc1328692edb7efc4b0b71ddc1"
      },
      (accessToken, refreshToken, profile, done) => {
        console.log("accessToken", accessToken);
        console.log("refreshToken", refreshToken);
        console.log("profile", profile);
        User.findOne({ "facebook.id": profile.id })
          .then(user => {
            if (user) {
              return done(null, user);
            }
            const newUser = new User({
              method: "facebook",
              facebook: {
                id: profile.id,
                email: profile.emails[0].value
              }
            });
            newUser
              .save()
              .then(user => console.log(user))
              .catch(err => console.log(err));
          })
          .catch(err => console.log(err.message));
      }
    )
  );
};
