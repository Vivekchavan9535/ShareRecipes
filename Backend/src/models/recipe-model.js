import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
	{
		createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		title: { type: String, required: true },
		img: String,
		description: { type: String, required: true },
		ingredients: { type: [String], required: true },
		instructions: { type: [String], required: true },
		time: { type: Number, required: true },
		servings: { type: Number, required: true },
		level: {
			type: String,
			enum: ["easy", "medium", "hard"],
			required: true,
		},
		category: {
			type: String,
			enum: ["Breakfast", "Lunch", "Dinner", "Dessert", "Snack"],
			required: true,
		},
		ratings: [
			{
				user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
				value: { type: Number, min: 1, max: 5 },
			},
		],
	}, { timestamps: true });


const Recipe = mongoose.model("Recipe", recipeSchema);
export default Recipe;