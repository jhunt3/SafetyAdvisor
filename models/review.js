/* Student mongoose model */
const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema({
	username: String,
	locId: Number,
	rating: Number,
	imagePath: String,
	review: String
});

const Review = mongoose.model('Review', ReviewSchema, "Reviews");

module.exports = { Review }
