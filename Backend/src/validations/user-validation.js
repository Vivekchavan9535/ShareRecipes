import Joi from "joi";

const userSignupValidationSchema = Joi.object({
	username: Joi.string().min(3).max(30).required(),
	email: Joi.string().email().required(),
	password: Joi.string().min(6).max(30).required()
})

const userUpdateValidationSchema = Joi.object({
	username: Joi.string().min(4).max(30),
	email: Joi.string().email(),
	password: Joi.string().min(6).max(30)
})


const userLoginValidationSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().min(6).max(30).required()
})

export { userSignupValidationSchema, userLoginValidationSchema, userUpdateValidationSchema }