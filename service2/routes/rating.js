const errors = require('restify-errors')
const Rating = require('../models/rating')


module.exports = ratingRoutes

function ratingRoutes(server) {
    server.get('/ratings', getRatings)
    server.get('/ratings/:id', getRating)
    server.get('/ratings/products/:id', getProductRating)
    server.post('/ratings', saveRating)
    server.put('/ratings/:id', updateRating)
    server.del('/ratings/:id', deleteRating)
}

function getRatings(_, res, next) {
    Rating.find().then(ratings => {
        res.send(ratings)
        next()
    }).catch(error => next(new errors.InvalidContentError(error)))
}

function getRating(req, res, next) {
    Rating.findById(req.params.id).then(rating => {
        res.send(rating)
        next()
    }).catch(error => next(new errors.ResourceNotFoundError(error)))
}

function getProductRating(req, res, next) {
    Rating.find({productId: req.params.id}).then(rating => {
        res.send(rating)
        next()
    }).catch(error => next(new errors.ResourceNotFoundError(error)))
}

function saveRating(req, res, next) {
    const rate = new Rating(req.body)
    rate.save().then(newRating => {
        res.json(newRating)
        next()
    }).catch(error => next(new errors.InternalError(error)))
}

function updateRating(req, res, next) {
    Rating.findByIdAndUpdate(req.params.id, req.body).then(response => {
        if(!response) return next(new errors.ResourceNotFoundError("id not found"))
        res.json(response)
        next()
    }).catch(error => next(new errors.InternalError(error)))
}

function deleteRating(req, res, next) {
    Rating.findByIdAndDelete(req.params.id).then(response => {
        if(!response) return next(new errors.ResourceNotFoundError("id not found"))
        res.json(response)
        next()
    }).catch(error => next(new errors.InternalError(error)))
}
