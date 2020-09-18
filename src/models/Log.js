const { Schema, model } = require("mongoose");

const logSchema = new Schema({
    user: {
        id: String,
        name: String
    },
    description: String,
    date: String
});

const Log = model("log", logSchema);

module.exports = Log;
