import { useNavigate } from "react-router-dom"
import { useState, useContext } from "react";
import UserContext from "../contexts/userContext"

function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate()

	const isFormValid = email.includes("@") && email.includes(".") && password.trim().length >= 8;

	const { handleLogin } = useContext(UserContext);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!isFormValid) return;
		handleLogin({ email, password });
	}

	return (
		<main className="bg-gray-200 h-screen flex justify-center items-center">
			<form onSubmit={(e) => handleSubmit(e)} className="h-100 w-100 bg-gray-300 rounded-[30px] flex gap-3 flex-col justify-center items-center" >
				<div>
					<h1 className="font-bold text-3xl">Login</h1>
				</div>
				<input className="border outline-0 rounded h-8 w-[70%] p-2 bg-red-50" placeholder="Enter Email"
					type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />

				<input className="border outline-0 rounded h-8 w-[70%] p-2 bg-red-50" placeholder="Enter Password" type="password"
					name="password" value={password} onChange={(e) => { setPassword(e.target.value) }} />

				<input type="submit" value="Login" disabled={!isFormValid} className={`px-3 py-1 border rounded font-semibold 
					${isFormValid ? "bg-white cursor-pointer hover:bg-gray-100" : "bg-gray-400 cursor-not-allowed"} transition-colors`} />


				<div className="cursor-pointer">
					<h2>Don't have an account? <span onClick={() => navigate("/signup")} className="font-bold">Register</span></h2>
				</div>

			</form>
		</main>
	)
}

export default Login