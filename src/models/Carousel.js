const { Schema, model } = require("mongoose");

const carouselSchema = new Schema({
	imgPath: String
});

const Carousel = model("carousel", carouselSchema);

module.exports = Carousel;
