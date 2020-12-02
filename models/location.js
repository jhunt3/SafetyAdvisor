/* Student mongoose model */
const mongoose = require('mongoose')

const tagSchema = new mongoose.Schema({
	tag: String,
	value: Number
});

const ReviewSchema = new mongoose.Schema({
	username: String,
	rating: Number,
	imagePath: String,
	reviewId: Number,
	review: String
});

const LocationSchema = mongoose.Schema({
	name: String,
	id: Number,
	venueType: String,
	lat: Number,
	lng: Number,
	avgRating: Number,
	numRating:  Number,
	tags: [tagSchema],
	imagePath: String,
	reviews: [ReviewSchema]
});

const Location = mongoose.model('Location', LocationSchema);

module.exports = { Location }
