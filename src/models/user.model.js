const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  role: {
    type: String,
    enum: ["ADMIN", "USER"],
    default: "USER",
  },
});

const User = mongoose.model("users", UserSchema);

module.exports = User;
