import { useEffect, useReducer } from "react";
import UserContext from "../contexts/userContext"
import axios from "../config/axios.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const userReducer = (state, action) => {
	switch (action.type) {
		case "SET_LOADING":
			return { ...state, loading: action.payload };
		case "LOGIN":
			return { ...state, isLoggedIn: true, user: action.payload, serverErrors: "", loading: false };
		case "LOGOUT":
			return { ...state, isLoggedIn: false, user: null, serverErrors: "", loading: false };
		case "SERVER_ERRORS":
			return { ...state, serverErrors: action.payload, loading: false };
		default:
			return state;
	}
}

function AuthProvider({ children }) {
	const [userState, userDispatch] = useReducer(userReducer, { user: null, isLoggedIn: false, serverErrors: "", loading: true });
	const navigate = useNavigate()

	const fetchAccount = async () => {
		if (localStorage.getItem("token")) {
			try {
				const res = await axios.get("/user/account", { headers: { Authorization: localStorage.getItem("token") } })
				userDispatch({ type: "LOGIN", payload: res.data })
			} catch (error) {
				console.log(error);
				localStorage.removeItem("token")
				userDispatch({ type: "SERVER_ERRORS", payload: error?.response?.data?.error })
			}
		} else {
			userDispatch({ type: "SET_LOADING", payload: false });
		}
	};

	useEffect(() => {
		fetchAccount()
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
			userDispatch({ type: "SERVER_ERRORS", payload: msg })
			toast.error(msg, {
				position: "top-center",
				autoClose: 2000,
				theme: "dark",
			});
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
			toast.error(msg, {
				position: "top-center",
				autoClose: 2000,
				theme: "dark",
			});
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
			userDispatch({ type: "SERVER_ERRORS", payload: error?.response?.data?.error });
		}
	}

	const handleDeleteAccount = async () => {
		if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
			try {
				await axios.delete("/user/delete", {
					headers: { Authorization: localStorage.getItem("token") }
				});
				localStorage.removeItem("token");
				userDispatch({ type: "LOGOUT" });
				navigate("/");
				alert("Account deleted successfully.");
			} catch (error) {
				console.log(error);
				userDispatch({ type: "SERVER_ERRORS", payload: error?.response?.data?.error });
				alert("Failed to delete account. Please try again.");
			}
		}
	}

	const handleUpdateProfile = async (formData) => {
		try {
			const res = await axios.put("/user/update", formData, {
				headers: { Authorization: localStorage.getItem("token") }
			});
			userDispatch({ type: "LOGIN", payload: res.data });
			alert("Profile updated successfully!");
			return true;
		} catch (error) {
			console.log(error);
			userDispatch({ type: "SERVER_ERRORS", payload: error?.response?.data?.error });
			alert(error?.response?.data?.error || "Failed to update profile");
			return false;
		}
	}


	return (
		<UserContext.Provider value={{ ...userState, handleLogin, handleLogout, handleSignup, handleDeleteAccount, handleUpdateProfile, userDispatch, fetchAccount }}>
			{children}
		</UserContext.Provider>
	)

}



export default AuthProvider