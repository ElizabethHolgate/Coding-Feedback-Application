const Joi = require('joi');

module.exports.moduleValidation = Joi.object({
    module: Joi.object({
        title: Joi.string().required(),
        code: Joi.string().required(),
        description: Joi.string(),
        tasks: Joi.array()
    }).required()
});
