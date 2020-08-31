const { Schema, model } = require("mongoose");

const serviceSchema = new Schema({
    name: String,
    description: String,
    icon: String,
    textColor: String,
    bgColor: String
});

const Service = model("service", serviceSchema);

module.exports = Service;
