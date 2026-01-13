import Joi from "joi";

const SignupValidationSchema = Joi.object({
	username: Joi.string().min(4).max(30).required(),
	email: Joi.string().email().min(3).max(100),
	password: Joi.string().min(8).max(30).required()
})

export default SignupValidationSchema;