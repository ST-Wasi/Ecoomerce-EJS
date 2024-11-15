const Joi = require('joi');

const productSchema = Joi.object({
    name: Joi.string().required().trim(),
    image: Joi.string().trim(),
    price: Joi.number().required().min(0),
    description:Joi.string().trim(),
})
const reviewSchema = Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().trim(),
})

module.exports = {productSchema,reviewSchema}