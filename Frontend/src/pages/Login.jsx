import { useNavigate, useSearchParams } from "react-router-dom"
import { useState, useContext } from "react";
import UserContext from "../contexts/userContext"

function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate()
	const [searchParams] = useSearchParams()

	const redirect = searchParams.get("redirect") || "/"

	const isFormValid = email.includes("@") && email.includes(".") && password.trim().length >= 5;

	const { handleLogin } = useContext(UserContext);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!isFormValid) return;
		const ok = await handleLogin({ email, password });
		if (ok) {
			navigate(redirect, { replace: true });
		}
	}



	const demoUsers = [
		{ label: "Demo User 1", email: "vivekchavan942@gmail.com", password: "vivek123" },
		{ label: "Demo User 2", email: "jassy@gmail.com", password: "jassy123" },
		{ label: "Demo User 3", email: "puttu@gmail.com", password: "puttu123" },
	];

	const handleDemoLogin = async (demo) => {
		setEmail(demo.email);
		setPassword(demo.password);
		const ok = await handleLogin({
			email: demo.email,
			password: demo.password,
		});
		if (ok) {
			navigate(redirect, { replace: true });
		}
	};

	return (
		<main className="bg-gray-200 h-screen flex justify-center items-center">

			<form onSubmit={(e) => handleSubmit(e)} className="h-100 w-100 bg-gray-300 rounded-[30px] flex gap-3 flex-col justify-center items-center" >

				{/* Demo Login */}
				<div className="w-[80%] flex gap-2 text-sm" >
					{demoUsers.map((demo) => (
						<button
							key={demo.email}
							type="button"
							onClick={() => handleDemoLogin(demo)}
							className="w-full bg-green-600 hover:bg-emerald-700 text-white py-2 rounded font-semibold"
						>
							{demo.label}
						</button>
					))}
				</div>


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