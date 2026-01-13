import Home from "./pages/Home"
import Navbar from "./components/Navbar"
import { Routes, Route } from "react-router-dom"
import Login from "./pages/Login";
import Signup from './pages/Signup'
import { useEffect } from "react";
import axios from "./config/axios"
import { useDispatch } from "react-redux";
import { fetchRecipes } from "./slices/recipeSlice";
import Profile from "./pages/Profile";



function App() {

	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(fetchRecipes())
	}, [])

	return (
		<>
			<Navbar />
			<div className="pt-20">
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="/signup" element={<Signup />} />
					<Route path="/" element={<Home />} />
					<Route path="/profile" element={<Profile />} />
				</Routes>
			</div>
		</>
	)
}

export default App
