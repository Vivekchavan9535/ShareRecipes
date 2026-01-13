import jwt from "jsonwebtoken";

const userAuthentication = async (req,res,next) => {
	const token = req.headers['authorization'];
	try {
		if(!token) return res.status(401).json({ error: "No token provided" });
		const tokenData = jwt.verify(token, process.env.SECRET_KEY);
		req.userId = tokenData.userId;
		next()
	} catch (error) {
		console.log({error:error.message});
		res.status(401).json({ error: "Invalid token" });
	}
}

export default userAuthentication;