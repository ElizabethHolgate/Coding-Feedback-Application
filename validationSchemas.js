const Joi = require('joi');

module.exports.moduleValidation = Joi.object({
    module: Joi.object({
        title: Joi.string().required(),
        code: Joi.string().required(),
        description: Joi.string(),
        tasks: Joi.array(),
        admins: Joi.array(),
        students: Joi.array()
    }).required()
});

module.exports.taskValidation = Joi.object({
    task: Joi.object({
        task: Joi.string().required(),
        modelAnswer: Joi.string().required(),
        studentAnswers: Joi.array()
    }).required()
});

module.exports.resourceValidation = Joi.object({
    resource: Joi.object({
        title: Joi.string().required(),
        language: Joi.string().required(),
        url: Joi.string().required(),
        level: Joi.number().required(),
        description: Joi.string()
    }).required()
});
