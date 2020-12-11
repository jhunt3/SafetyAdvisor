/* Student mongoose model */
const mongoose = require('mongoose')

const LocationSchema = mongoose.Schema({
	name: String,
	venueType: String,
	lat: Number,
	lng: Number,
	avgRating: Number,
	numRatings: Number,
	tags: [{
		tag: String,
		val: Number
	}]
});

const Location = mongoose.model('Location', LocationSchema, "Locations");

module.exports = { Location }
