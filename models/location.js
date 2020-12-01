/* Student mongoose model */
const mongoose = require('mongoose')

const LocationSchema = mongoose.Schema('Student', {
	name: {
		type: String,
		required: true,
		minlegth: 1,
		trim: true
	},
	id: {
		type: Number,
		required: true,
	},
	venueType: {
		type: String,
		required: true,
		minlegth: 1,
		trim: true
	},
	lat: {
		type: Number,
		required: true,
	},
	lng: {
		type: Number,
		required: true,
	},
	avgRating: {
		type: Number,
		required: true,
		default: 2.5
	},
	numRating: {
		type: Number,
		required: true,
		default: 0
	},
	tags: {
		type: [String],
		required: true
	},
	imagePath: {
		type: String,
		required: true
	},
	reviews: {
		type: [String],
		required: true
	}
});

const ReviewSchema = new mongoose.Schema({
	username: String,
	rating: Number,
	imagePath: String,
	reviewId: Number,
	review: String
});

const Location = mongoose.model('Location', LocationSchema);

module.exports = { Location }
