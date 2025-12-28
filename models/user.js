const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    // Password: required only for non-OAuth users
    password: {
      type: String,
      required: function () {
        return !this.oauthProvider;
      }
    },

    // OAuth fields
    oauthProvider: {
      type: String,
      default: null
    },
    oauthId: {
      type: String,
      default: null
    },

    // User role
    role: {
      type: String,
      default: "user"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
