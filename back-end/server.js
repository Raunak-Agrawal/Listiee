const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const users = require("./routes/api/users");

//DB config
const db = require("./config/keys").mongoURI;

const port = process.env.port || 5000;
const app = express();

//middleware

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//connect to mongoDB
mongoose
  .connect(db)
  .then(() => console.log("connected to database"))
  .catch(err => console.log(err));

//passport middleware
app.use(passport.initialize());

//passport Config has local stragegy or google stragegy or jwt stragegy. We use jwt stragegy here.
require("./config/passport")(passport);

app.get("/", (req, res) => res.send("Hello  from Listiee11"));

//use routes
app.use("/api/users", users);

app.listen(port, () => console.log(`Server up and running on port ${port}`));
