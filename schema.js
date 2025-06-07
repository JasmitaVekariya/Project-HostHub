const joi = require('joi');

const listingSchema = joi.object({
    listing: joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        price: joi.number().required().min(0),
        country: joi.string().required(),
        location: joi.string().required(),
        image: joi.string().uri().allow("", null)
    }).required()
});

const reviewSchema = joi.object({
    comment: joi.string().required(),
    rating: joi.number().required().min(1).max(5)
});

module.exports = {
    listingSchema,
    reviewSchema
};