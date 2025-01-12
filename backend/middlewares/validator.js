const Joi=require('joi');

exports.signupSchema=Joi.object({
    email: Joi.string().min(6).max(80).email().required(),
    password: Joi.string().min(8).required().pattern(new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/)),
    fullName: Joi.string().min(3).max(80).required(),
    phone: Joi.string().pattern(/^[0-9]{10}$/).required()
});

exports.signinSchema=Joi.object({
    email: Joi.string().min(6).max(80).email().required(),
    password: Joi.string().min(8).required().pattern(new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/))
});