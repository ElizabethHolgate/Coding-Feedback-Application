const Joi = require('joi');

module.exports.moduleValidation = Joi.object({
    module: Joi.object({
        title: Joi.string().required(),
        code: Joi.string().required(),
        description: Joi.string(),
        tasks: Joi.array()
    }).required()
});

module.exports.taskValidation = Joi.object({
    task: Joi.object({
        task: Joi.string().required(),
        modelAnswer: Joi.string().required(),
        studentAnswers: Joi.array()
    }).required()
});
