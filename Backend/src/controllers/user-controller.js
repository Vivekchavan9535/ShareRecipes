import Recipe from '../models/recipe-model.js';
import User from '../models/user-model.js'
import { userSignupValidationSchema, userLoginValidationSchema, userUpdateValidationSchema } from "../validations/user-validation.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userCtlr = {};


userCtlr.signup = async (req, res) => {
	const { username, email, password } = req.body || {};


	try {
		const { value, error } = userSignupValidationSchema.validate({ username, email, password });
		if (error) {
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

		const token = jwt.sign({ userId: user._id, username: user.username, email: user.email }, "vivek@9535");
		res.json({ token });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}

userCtlr.account = async (req, res) => {
	try {
		const user = await User.findById(req.userId)
		res.json(user)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}

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
		const user = await User.findByIdAndDelete({ _id: req.userId })
		if (!user) {
			return res.status(404).json({ error: "User not found" })
		}
		res.json(user)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}

}

userCtlr.favorites = async (req, res) => {
	try {
		const user = await User.findById(req.userId).populate('favorites');

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

		// check if recipe is already in favorites
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

//MyPosts CRUD operations;
userCtlr.myposts = async (req, res) => {
	try {
		const posts = await Recipe.find({ createdBy: req.userId });
		if (posts.length === 0) {
			return res.status(404).json({ error: "You have not posted anything" })
		}
		res.json(posts)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}







export default userCtlr;
