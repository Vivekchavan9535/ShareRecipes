import Joi from "joi";

const recipeValidationSchema = Joi.object({
    createdBy: Joi.string().required(),
    title: Joi.string().min(3).max(50).required(),
    img: Joi.string().uri().optional(),
    description: Joi.string().min(10).required(),
    ingredients: Joi.array().items(Joi.string().required()).min(1).required(),
    instructions: Joi.array().items(Joi.string().required()).min(1).required(),
    time: Joi.number().integer().min(1).required(),
    servings: Joi.number().integer().min(1).required(),
    level: Joi.string().valid("easy", "medium", "hard").required(),
    category: Joi.string().valid("Breakfast", "Lunch", "Dinner", "Dessert", "Snack").required()
});

export { recipeValidationSchema };