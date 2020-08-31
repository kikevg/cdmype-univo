const { Schema, model } = require("mongoose");

const allianceSchema = new Schema({
    name: String,
    description: String,
    imgPath: String,
});

const Alliance = model("alliance", allianceSchema);

module.exports = Alliance;
