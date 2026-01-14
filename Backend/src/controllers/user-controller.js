import Recipe from '../models/recipe-model.js';
import User from '../models/user-model.js'
import { userSignupValidationSchema, userLoginValidationSchema, userUpdateValidationSchema } from "../validations/user-validation.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userCtlr = {};


userCtlr.signup = async (req, res) => {
	const { username, email, password } = req.body;


	try {
		console.log("Signup Request Body:", req.body);
		const { value, error } = userSignupValidationSchema.validate({ username, email, password });
		if (error) {
			console.log("Signup Validation Error:", error.message);
			return res.status(400).json({ error: error.message });
		}

		const existingUser = await User.findOne({ email: value.email });
		if (existingUser) {
			return res.status(400).json({ error: "User already exists" });
		}

		const hashPassword = await bcrypt.hash(value.password, 10);

		const user = await User.create({ username: value.username, email: value.email, password: hashPassword });
		res.json({ message: "User registered successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

userCtlr.login = async (req, res) => {
	const { email, password } = req.body || {};
	try {
		const { value, error } = userLoginValidationSchema.validate({ email, password });
		if (error) {
			return res.status(400).json({ error: error.message });
		}
		const user = await User.findOne({ email: value.email });
		if (!user) {
			return res.status(400).json({ error: "User not found" });
		}

		const ok = await bcrypt.compare(value.password, user.password);
		if (!ok) {
			return res.status(403).json({ error: "Invalid email/password" });
		}

		const token = jwt.sign({ userId: user._id, username: user.username, email: user.email }, process.env.SECRET_KEY);
		res.json({ token });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}

userCtlr.account = async (req, res) => {
	try {
		const user = await User.findById(req.userId).populate('posts');
		if (!user) return res.status(404).json({ error: "User not found" });

		const validPosts = user.posts.filter(post => post !== null);

		if (validPosts.length !== user.posts.length) {
			user.posts = validPosts.map(post => post._id);
			await user.save();
		}

		res.json(user);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

userCtlr.update = async (req, res) => {
	const { username, email, password } = req.body;

	try {
		const { error, value } = userUpdateValidationSchema.validate({ username, email, password });
		if (error) {
			console.log("Validation error:", error.message);
			return res.status(400).json({ error: error.message })
		}

		if (value.password) {
			value.password = await bcrypt.hash(value.password, 10);
		}
		const user = await User.findOneAndUpdate({ _id: req.userId }, value, { new: true })
		if (!user) return res.status(404).json({ error: "User not found" });

		res.json(user)

	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}

userCtlr.delete = async (req, res) => {
	try {
		const userId = req.userId;

		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const userRecipes = await Recipe.find({ createdBy: userId });
		const recipesIds = userRecipes.map((recipe) => recipe._id);


		await Promise.all([
			Recipe.deleteMany({ createdBy: userId }),

			User.updateMany(
				{ favorites: { $in: recipesIds } },
				{ $pull: { favorites: { $in: recipesIds } } }
			),

			User.findByIdAndDelete(userId),
		]);

		res.json("Account and all recipes deleted");
	} catch (error) {
		console.error("Delete error:", error);
		res.status(500).json({ error: "Failed to delete account" });
	}
};

userCtlr.favorites = async (req, res) => {
	try {
		const user = await User.findById(req.userId).populate({
			path: 'favorites',
			populate: {
				path: 'createdBy',
				select: 'username'
			}
		});

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		if (user.favorites.length === 0) {
			return res.json([]);
		}

		res.json(user.favorites);
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}

userCtlr.addRemoveFavorite = async (req, res) => {
	const recipeId = req.params.id;
	const userId = req.userId;

	try {
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}


		const isFavorite = user.favorites.includes(recipeId);

		if (isFavorite) {
			await User.findByIdAndUpdate(userId, { $pull: { favorites: recipeId } });
			return res.json({ message: "Removed from favorites", isFavorite: false });
		} else {
			await User.findByIdAndUpdate(userId, { $addToSet: { favorites: recipeId } });
			return res.json({ message: "Added to favorites", isFavorite: true });
		}

	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}

userCtlr.myposts = async (req, res) => {
	try {
		const posts = await Recipe.find({ createdBy: req.userId }).populate("createdBy", "username");
		if (posts.length === 0) {
			return res.status(404).json({ error: "You have not posted anything" })
		}
		res.json(posts)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}







export default userCtlr;
