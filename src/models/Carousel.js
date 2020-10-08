const { Schema, model } = require("mongoose");

const carouselSchema = new Schema({
	name: String,
	description: String,
	index: Number,
	imgPath: String
});

const Carousel = model("carousel", carouselSchema);

module.exports = Carousel;
