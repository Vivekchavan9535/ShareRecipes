import configDb from "./config/db.js";
import userCtlr from './src/controllers/user-controller.js'
import recipeCtlr from "./src/controllers/recipe-controller.js"
import userAuthentication from './src/middlewares/userAuthentication.js'
import express from 'express';
import cors from "cors"
import { Server } from "socket.io";
const app = express();
const port = process.env.PORT || 8080;

import dotenv from 'dotenv';
dotenv.config()

configDb();
app.use(cors());
app.use(express.json());

//User
app.post("/signup", userCtlr.signup);
app.post("/login", userCtlr.login)

app.get("/user/account", userAuthentication, userCtlr.account)
app.put("/user/update", userAuthentication, userCtlr.update);
app.delete("/user/delete", userAuthentication, userCtlr.delete);

app.get("/user/myposts", userAuthentication, userCtlr.myposts);
app.get("/user/favorites", userAuthentication, userCtlr.favorites);
app.put("/user/favorites/:id", userAuthentication, userCtlr.addRemoveFavorite);

//recipes
app.post("/recipes", userAuthentication, recipeCtlr.create);
app.get("/recipes", recipeCtlr.getAll);
app.get("/recipes/:id", recipeCtlr.getOne);
app.put("/recipes/:id", userAuthentication, recipeCtlr.update);
app.delete("/recipes/:id", userAuthentication, recipeCtlr.delete);
app.put("/recipes/:id/rating", userAuthentication, recipeCtlr.rateRecipe)








app.listen(port, () => {
	console.log("Server is running on " + port);
})