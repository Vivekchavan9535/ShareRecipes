import mongoose from "mongoose";

async function configDB(){
	try {
		await mongoose.connect("mongodb+srv://vivekchavan942_db_user:9w6ZrIgtReMnHkw5@sharerecipes.x1weh0b.mongodb.net/?appName=ShareRecipes");
		console.log("MongoDb Atlas is connected");
	} catch (error) {
		console.log("Db connection failed");	
		console.log(error.message);
	}
}

export default configDB;