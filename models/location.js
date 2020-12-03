/* Student mongoose model */
const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema({
	username: String,
	rating: Number,
	imagePath: String,
	reviewId: Number,
	review: String
});

const LocationSchema = mongoose.Schema({
	name: String,
	venueType: String,
	lat: Number,
	lng: Number,
	avgRating: Number,
	numRating:  Number,
	tags: [{
		tag: String,
		val: Number
	}],
	imagePath: String,
	reviews: [ReviewSchema]
});

const Location = mongoose.model('Location', LocationSchema, "Locations");

module.exports = { Location }
