import Joi from "joi";

const postRecipeValidationSchema = Joi.object({
    title: Joi.string().min(3).required().messages({
        "string.empty": "Title is required",
        "string.min": "Title must be at least 3 characters"
    }),
    description: Joi.string().min(10).required().messages({
        "string.empty": "Description is required",
        "string.min": "Description must be at least 10 characters"
    }),
    img: Joi.string().uri().allow("").messages({
        "string.uri": "Invalid image URL"
    }),
    time: Joi.number().positive().required().messages({
        "number.base": "Time must be a number",
        "number.positive": "Time must be positive"
    }),
    servings: Joi.number().positive().required().messages({
        "number.base": "Servings must be a number",
        "number.positive": "Servings must be positive"
    }),
    level: Joi.string().valid("easy", "medium", "hard").required().messages({
        "any.only": "Invalid difficulty level"
    }),
    category: Joi.string().valid("Breakfast", "Lunch", "Dinner", "Snack", "Dessert").required().messages({
        "any.only": "Invalid category"
    }),
    ingredients: Joi.array().items(Joi.string().required()).min(1).required().messages({
        "array.min": "At least one ingredient is required"
    }),
    instructions: Joi.array().items(Joi.string().required()).min(1).required().messages({
        "array.min": "At least one instruction is required"
    })
}).unknown(true);

export default postRecipeValidationSchema;
