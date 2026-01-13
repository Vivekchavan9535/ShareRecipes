import Recipe from "../models/recipe-model.js"
import User from "../models/user-model.js";
import { recipeValidationSchema } from "../validations/recipe-validation.js";

const recipeCtlr = {};

recipeCtlr.create = async (req, res) => {
    const body = req.body;
    try {
        const createdBy = req.userId
        const { error, value } = recipeValidationSchema.validate({ createdBy, ...body })
        if (error) {
            return res.status(400).json({ error: error.message });
        }

        const recipe = await Recipe.create(value);
        // Fix: Use simple ID, not object
        const user = await User.findById(createdBy)
        user.posts.push(recipe._id)
        await user.save()
        res.status(201).json(recipe);

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


recipeCtlr.getAll = async (req, res) => {
    try {
        const recipes = await Recipe.find();
        if (recipes.length === 0) {
            return res.status(404).json({ error: "No recipes found" })
        }
        res.json(recipes)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

recipeCtlr.getOne = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ error: "Recipe not found" });
        res.json(recipe);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

recipeCtlr.update = async (req, res) => {
    try {
        const id = req.params.id;
        const recipe = await Recipe.findOne({ _id: id, createdBy: req.userId });
        if (!recipe) {
            return res.status(404).json({ error: "Recipe not found or you are not authorized to edit it" });
        }
        const updatedRecipe = await Recipe.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedRecipe);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

recipeCtlr.delete = async (req, res) => {
    try {
        const id = req.params.id;
        const recipe = await Recipe.findOneAndDelete({ _id: id, createdBy: req.userId });

        if (!recipe) {
            return res.status(404).json({ error: "Recipe not found or you are not authorized to delete it" });
        }

        await User.findByIdAndUpdate(req.userId, { $pull: { posts: id } });

        res.json({ message: "Recipe deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

recipeCtlr.rateRecipe = async (req, res) => {
    const recipeId = req.params.id;
    const userId = req.userId;
    const { value } = req.body;
    try {
        const recipe = await Recipe.findById(recipeId)
        if (!recipe) {
            return res.status(404).json({ error: "Recipe not found" });
        }

        if (recipe.createdBy.toString() === userId) {
            return res.status(400).json({ error: "You can't rate yourself" })
        }

        const existingRating = recipe.ratings.find((r) => {
            return r.user && r.user.toString() === userId;
        })


        if (existingRating) {
            existingRating.value = value;
        } else {
            recipe.ratings.push({ user: userId, value })
        }
        await recipe.save()
        res.json(recipe);

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export default recipeCtlr;
