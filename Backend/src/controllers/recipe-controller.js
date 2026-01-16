import mongoose from "mongoose";
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
        const recipes = await Recipe.find().sort({ ratingsCount: -1, avgRating: -1 }).populate("createdBy", "username");

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
    const session = await mongoose.startSession()
    try {
        await session.withTransaction(async () => {
            const id = req.params.id;
            const deletedRecipe = await Recipe.findOneAndDelete({ _id: id, createdBy: req.userId }, { session });

            if (!deletedRecipe) {
                throw new Error("Recipe not found or unauthorized");
            }

            await User.findByIdAndUpdate(req.userId, { $pull: { posts: deletedRecipe._id } }, { session })
            await User.updateMany({}, { $pull: { favorites: deletedRecipe._id } }, { session })
        })

        session.endSession();
        res.json({ message: "Recipe deleted successfully" });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ error: error.message });
    }
}



recipeCtlr.rateRecipe = async (req, res) => {
    const recipeId = req.params.id;
    const userId = new mongoose.Types.ObjectId(req.userId);
    const { value } = req.body;


    if (typeof value !== 'number' || value < 1 || value > 5) {
        return res.status(400).json({ error: "Rating must be a number between 1 and 5" });
    }

    try {
        const recipeCheck = await Recipe.findOne({
            _id: recipeId,
            createdBy: { $ne: userId }  // REMOVED extra { } around userId
        });

        if (!recipeCheck) {
            return res.status(404).json({
                error: "Recipe not found or you can't rate your own recipe"
            });
        }


        const updatedRecipe = await Recipe.findOneAndUpdate(
            { _id: recipeId },
            [
                {
                    $set: {
                        ratings: {
                            $cond: [

                                { $in: [userId, "$ratings.user"] },

                                {
                                    $map: {
                                        input: "$ratings",
                                        as: "rating",
                                        in: {
                                            $cond: [
                                                { $eq: ["$$rating.user", userId] },
                                                { $mergeObjects: ["$$rating", { value: value }] },
                                                "$$rating"
                                            ]
                                        }
                                    }
                                },

                                {
                                    $concatArrays: [
                                        "$ratings",
                                        [{ user: userId, value: value }]
                                    ]
                                }
                            ]
                        }
                    }
                },
                {
                    $set: {
                        ratingsCount: { $size: "$ratings" },
                        avgRating: {
                            $cond: [
                                { $gt: [{ $size: "$ratings" }, 0] },
                                { $round: [{ $avg: "$ratings.value" }, 1] },
                                0
                            ]
                        }
                    }
                }
            ],
            {
                new: true,
                updatePipeline: true
            }
        ).populate("createdBy", "username");

        res.json(updatedRecipe);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};





export default recipeCtlr;
