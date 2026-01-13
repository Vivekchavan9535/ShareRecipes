import { useNavigate } from "react-router-dom";
import UserContext from '../contexts/userContext';
import { useState, useContext } from 'react';
import SignupValidationSchema from "../validations/signup-validation.js"

function Signup() {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState({});

	const navigate = useNavigate()
	const { handleSignup } = useContext(UserContext)

	const handleSubmit = (e) => {
		e.preventDefault();
		const { error } = SignupValidationSchema.validate({ username, email, password }, {
			abortEarly: false
		});

		if (error) {
			const fieldErrors = {};
			error.details.forEach(err => {
				fieldErrors[err.path[0]] = err.message;
			});

			setErrors(fieldErrors);
			return;
		}

		setErrors({});
		console.log("Form is valid");

		const resetForm = () => {
			setUsername("")
			setEmail("")
			setPassword("")
		}

		handleSignup({ username, email, password }, { resetForm });
	}

	return (
		<main className="bg-gray-200 h-screen flex justify-center items-center">
			<form onSubmit={(e) => handleSubmit(e)} className="h-100 w-100 bg-gray-300 rounded-[30px] flex gap-3 flex-col justify-center items-center" >
				<div>
					<h1 className="font-bold text-3xl">Signup</h1>
				</div>
				<input className="border outline-0 rounded h-8 w-[70%] p-2 bg-red-50" type="text" placeholder="Enter Username"
					name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
				{errors.username && <h2 className="text-red-900">{errors.username}</h2>}

				<input className="border outline-0 rounded h-8 w-[70%] p-2 bg-red-50" type="email" placeholder="Enter Email"
					name="email" value={email} onChange={(e) => setEmail(e.target.value)}
				/>
				{errors.email && <h2 className="text-red-900">{errors.email}</h2>}


				<input className="border outline-0 rounded h-8 w-[70%] p-2 bg-red-50" type="password" placeholder="Enter Password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}
				/>
				{errors.password && <h2 className="text-red-900">{errors.password}</h2>}

				<input className="px-3 py-1 border rounded font-semibold bg-white cursor-pointer hover:bg-gray-100 transition-colors" type="submit" value="Register" />

				<div className="cursor-pointer">
					<h2>Already have an account? <span onClick={() => navigate("/login")} className="font-bold">Login</span></h2>
				</div>
			</form>
		</main>
	)
}

export default Signup