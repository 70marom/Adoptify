const BaseJoi = require('joi');
const sanitize = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitize(value, {
                    allowedTags: [],
                    allowedAttributes: {}
                });
                if(clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const joi = BaseJoi.extend(extension);

module.exports.animalSchema = joi.object({
    animal: joi.object({
        category: joi.string().required(),
        name: joi.string().required().escapeHTML(),
        age: joi.number().required().min(0),
        ageType: joi.string().required(),
        gender: joi.string().required(),
        description: joi.string().required().escapeHTML(),
        location: joi.string().required().escapeHTML(),
    }).required(),
    deleteImages: joi.array()
});

module.exports.reviewSchema = joi.object({
    review: joi.object({
        rating: joi.number().required().min(1).max(5),
        body: joi.string().required().escapeHTML()
    }).required()
})