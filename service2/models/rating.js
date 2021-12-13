const mongoose = require('mongoose')


const RatingSchema = new mongoose.Schema({
    productId: {type: Number, required: true},
    userId: {type: Number, required: true},
    score: {type: Number, required: true, min: 1, max: 5},
    message: {type: String, required: false, default: ''},
})

RatingSchema.index({ productId: 1, userId: 1 }, { unique: true })
module.exports = mongoose.model('Rating', RatingSchema)
