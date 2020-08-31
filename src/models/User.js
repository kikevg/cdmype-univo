const { Schema, model } = require("mongoose");

const userSchema = new Schema({
    name: String,
    email: String,
    username: String,
    password: String
});

const User = model("user", userSchema);

module.exports = User;
