const { Schema, model } = require("mongoose");

const businessSchema = new Schema({
    name: String,
    own: String,
    description: String,
    yearFundation: String,
    imgPath: String
});

const Business = model("business", businessSchema);

module.exports = Business;
