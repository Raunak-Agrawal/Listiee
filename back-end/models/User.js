const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  method: {
    type: String,
    enum: ["local", "google", "facebook"]
  },
  local: {
    email: {
      type: String
    },
    password: {
      type: String
    }
  },
  name: {
    type: String
  },

  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  active: {
    type: Boolean
  },
  secretToken: {
    type: String
  },
  google: {
    id: {
      type: String
    },
    email: {
      type: String,
      lowercase: true
    }
  },
  facebook: {
    id: {
      type: String
    },
    email: {
      type: String,
      lowercase: true
    }
  }
});

module.exports = User = mongoose.model("users", UserSchema);
