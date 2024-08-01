const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userRegistration = async (user) => {
  try {
    const userData = await findUserByEmail(user.email);

    if (userData) {
      const error = new Error("User already exist");
      error.statusCode = 403;
      throw error;
    }

    const hashPassword = await bcrypt.hash(user.password, 12);

    user.password = hashPassword;

    await User.create(user);

    return;
  } catch (error) {
    throw error;
  }
};

const userLogin = async (user) => {
  try {
    const userData = await findUserByEmail(user.email);

    if (!userData) {
      const error = new Error("User is not registered. Please sign up first");
      error.statusCode = 403;
      throw error;
    }

    const isPasswordEqual = await bcrypt.compare(
      user.password,
      userData.password
    );

    if (!isPasswordEqual) {
      const error = new Error("Password is incorrect");
      error.statusCode = 403;
      throw error;
    }

    const token = await jwt.sign(
      { _id: userData._id, role: userData.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "30d" }
    );

    return token;
  } catch (error) {
    throw error;
  }
};

const findUserByEmail = (email) => {
  return User.findOne({ email: email });
};

module.exports = {
  userRegistration,
  userLogin,
};
