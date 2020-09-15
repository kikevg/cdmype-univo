const { Schema, model } = require("mongoose");

const serviceSchema = new Schema({
    name: String,
    description: String,
    iconName: String,
    iconColor: String,
    bgColor: String
});

const Service = model("service", serviceSchema);

module.exports = Service;
