import Recipe from "../models/recipe-model.js"
import User from "../models/user-model.js";
import { recipeValidationSchema } from "../validations/recipe-validation.js";

const recipeCtlr = {};


recipeCtlr.search = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.trim() === "") {
            return res.json([]);
        }

        const recipes = await Recipe.find({
            $or: [
                { title: { $regex: q, $options: 'i' } },
                { ingredients: { $regex: q, $options: 'i' } },
                { category: { $regex: q, $options: 'i' } }
            ]
        }).populate("createdBy", "username");

        res.json(recipes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

recipeCtlr.create = async (req, res) => {
    const body = req.body;
    try {
        const createdBy = req.userId
        const { error, value } = recipeValidationSchema.validate({ createdBy, ...body })
        if (error) {
            return res.status(400).json({ error: error.message });
        }

        const recipe = await Recipe.create(value);
        const populatedRecipe = await Recipe.findById(recipe._id).populate("createdBy", "username");

        const user = await User.findById(createdBy)
        user.posts.push(recipe._id)
        await user.save()
        res.status(201).json(populatedRecipe);

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


recipeCtlr.getAll = async (req, res) => {
    try {
        const recipes = await Recipe.find().populate("createdBy", "username");

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
        const recipe = await Recipe.findById(req.params.id).populate("createdBy", "username");
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
        const updatedRecipe = await Recipe.findByIdAndUpdate(id, req.body, { new: true }).populate("createdBy", "username");
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

        await Promise.all([
            User.findByIdAndUpdate(req.userId, { $pull: { posts: recipe._id } }),
            User.updateMany({}, { $pull: { favorites: recipe._id } })
        ]);

        res.json({ message: "Recipe deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

recipeCtlr.rateRecipe = async (req, res) => {
    const recipeId = req.params.id;
    const userId = req.userId;
    const { value } = req.body;

    if (typeof value !== 'number' || value < 1 || value > 5) {
        return res.status(400).json({ error: "Rating must be a number between 1 and 5" });
    }

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
            recipe.ratings.push({ user: userId, value });
        }

        recipe.ratingsCount = recipe.ratings.length;
        const total = recipe.ratings.reduce((sum, r) => sum + (Number(r.value) || 0), 0);
        recipe.avgRating = Number((total / recipe.ratingsCount).toFixed(1));
        await recipe.save();

        const populatedRecipe = await Recipe.findById(recipe._id).populate("createdBy", "username");
        res.json(populatedRecipe);

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}



export default recipeCtlr;
