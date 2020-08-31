const { Schema, model } = require("mongoose");

const newsSchema = new Schema({
    title: String,
    description: { type: String, maxlength: 2000 },
    category: String,
    date: String,
    images: { type: Array}
});

const News = model("news", newsSchema);

module.exports = News;
