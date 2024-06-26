const Joi = require('@hapi/joi')

// const validateBody = (schema) => {
//     return (req, res, next) => {
//         const validatorResult = schema.validate(req.body)

//         if (validatorResult.error) {
//             return res.status(400).json({'mess': 'o day', 'res' : validatorResult.error})
//         } else {
//             if (!req.value) req.value = {}
//             if (!req.value['params']) req.value.params = {}

//             req.value.body = validatorResult.value
//             next()
//         }
//     }
// }

const validateBody = (schema) => {
    return (req, res, next) => {
        const validatorResult = schema.validate(req.body);

        if (validatorResult.error) {
            return res.status(400).json({ error: validatorResult.error.details[0].message });
        }


        if (!req.value) req.value = {};
        if (!req.value['params']) req.value.params = {};

        req.value.body = validatorResult.value;
        next();
    };
};

const validateParam = (schema, name) => {
    return (req, res, next) => {
        const validatorResult = schema.validate({param: req.params[name]})

        if (validatorResult.error) {
            return res.status(400).json(validatorResult.error)
        } else {
            if (!req.value) req.value = {}
            if (!req.value['params']) req.value.params = {}

            req.value.params[name] = req.params[name]
            next()
        }
    }
}

const schemas = {
    authSignUpSchema: Joi.object().keys({
        UserAccount: Joi.string().min(3).required(),
        Password: Joi.string().min(6).required(),
        Email: Joi.string().email().required()
    }),
    authSignInSchema: Joi.object().keys({
        Email: Joi.string().email().required(),
        Password: Joi.string().min(6).required()
    }),
    deckSchema: Joi.object().keys({
        name: Joi.string().min(6).required(),
        description: Joi.string().min(10).required()
    }),

    deckOptionalSchema: Joi.object().keys({
        name: Joi.string().min(5),
        description: Joi.string().min(10),
        owner: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
    }),

    idSchema: Joi.object().keys({
        param: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    }),

    newDeckSchema: Joi.object().keys({
        name: Joi.string().min(5).required(),
        description: Joi.string().min(10).required(),
        owner: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    }),

    accountSchema: Joi.object().keys({
        UserAccount: Joi.string().required(),
        Password: Joi.string().required(),
        Role: Joi.string(),
        PhoneNumber: Joi.string(),
        Address: Joi.string(),
        Email: Joi.string().email().required()
    }),
    
    accountOptionalSchema: Joi.object().keys({
        UserAccount: Joi.string(),
        Password: Joi.string(),
        Role: Joi.string(),
        PhoneNumber: Joi.string(),
        Address: Joi.string(),
        Email: Joi.string().email()
    })
}

module.exports = {
    validateBody,
    validateParam,
    schemas
}