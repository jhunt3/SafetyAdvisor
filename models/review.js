/* Student mongoose model */
const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema({
	username: String,
	locId: String,
	rating: Number,
	locImagePath: String,
	usrImagePath: String,
	tags: [{
		tag: String,
		val: Boolean
	}],
	review: String
});

const Review = mongoose.model('Review', ReviewSchema, "Reviews");

module.exports = { Review }
