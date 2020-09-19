const { Schema, model } = require("mongoose");

const carouselSchema = new Schema({
	name: String,
	description: String,
	imgPath: String
});

const Carousel = model("carousel", carouselSchema);

module.exports = Carousel;
