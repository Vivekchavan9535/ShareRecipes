import mongoose from "mongoose";

async function configDB() {
	try {
		await mongoose.connect(process.env.MONGODB_URL);
		console.log("MongoDb Atlas is connected");
	} catch (error) {
		console.log("Db connection failed");
		console.log(error.message);
	}
}

export default configDB;