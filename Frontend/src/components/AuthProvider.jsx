import { useEffect, useReducer } from "react";
import UserContext from "../contexts/userContext"
import axios from "../config/axios.js";
import { useNavigate } from "react-router-dom";

const userReducer = (state, action) => {
	switch (action.type) {
		case "LOGIN":
			return { ...state, isLoggedIn: true, user: action.payload, serverErrors: "" };
		case "LOGOUT":
			return { ...state, isLoggedIn: false, user: null, serverErrors: "" };
		case "SERVER_ERRORS":
			return { ...state, serverErrors: action.payload };
		default:
			return state;
	}
}

function AuthProvider({ children }) {
	const [userState, userDispatch] = useReducer(userReducer, { user: null, isLoggedIn: false, serverErrors: "", loading: false });
	const navigate = useNavigate()

	useEffect(() => {
		if (localStorage.getItem("token")) {
			async function fetchUser() {
				try {
					const res = await axios.get("/user/account", { headers: { Authorization: localStorage.getItem("token") } })
					userDispatch({ type: "LOGIN", payload: res.data })
				} catch (error) {
					console.log(error);
					localStorage.removeItem("token")
					userDispatch({ type: SERVER_ERRORS, payload: error?.response?.data?.error })
				}
			}
			fetchUser()
		}
	}, [])




	const handleLogin = async (formData) => {
		try {
			const res = await axios.post("/login", formData)
			const token = res.data.token;
			localStorage.setItem("token", token)

			const user = await axios.get("/user/account", { headers: { Authorization: localStorage.getItem("token") } });
			console.log(user.data);
			userDispatch({ type: "LOGIN", payload: user.data })
			navigate("/");
		} catch (error) {
			const msg = error?.response?.data?.error;
			console.log(msg);
			userDispatch({ type: SERVER_ERRORS, payload: error?.response?.data?.error })
			alert(msg)
		}
	}



	const handleSignup = async (formData, { resetForm }) => {
		try {
			const res = await axios.post("/signup", formData);
			alert(res.data.message)
			resetForm()
			navigate("/login")
		} catch (err) {
			const msg = err?.response?.data
			alert(msg);
			userDispatch({ type: "SERVER_ERRORS", payload: msg });
		}
	}

	const handleLogout = () => {
		try {
			localStorage.removeItem("token")
			userDispatch({ type: "LOGOUT" })
			navigate("/")
		} catch (error) {
			console.log(error);
		}
	}


	return (
		<UserContext.Provider value={{ ...userState, handleLogin, handleLogout, handleSignup, userDispatch }}>
			{children}
		</UserContext.Provider>
	)

}



export default AuthProvider