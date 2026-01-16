import Home from "./pages/Home"
import Navbar from "./components/Navbar"
import { Routes, Route, useNavigate } from "react-router-dom"
import Login from "./pages/Login";
import Signup from './pages/Signup'
import { useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchRecipes } from "./slices/recipeSlice";
import { fetchMyPosts } from "./slices/myPostsSlice"
import Profile from "./pages/Profile";
import UserContext from "./contexts/userContext";
import MyPosts from "./pages/MyPosts";
import Favorites from "./pages/Favorites";
import PostRecipe from "./pages/PostRecipe";
import { toast, ToastContainer } from "react-toastify";
import RecipeDetails from "./pages/RecipeDetails";
import EditRecipe from "./pages/EditRecipe";


import ProtectedRoute from "./components/ProtectedRoute";

function App() {
	const { user, isLoggedIn } = useContext(UserContext)
	const dispatch = useDispatch()


	useEffect(() => {
		if (isLoggedIn) {
			dispatch(fetchMyPosts())
		}
	}, [dispatch, isLoggedIn])


	return (
		<>
			<ToastContainer
				position="top-center"
				autoClose={1500}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="dark"
			/>
			<Navbar />
			<div className="pt-20">

				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="/signup" element={<Signup />} />
					<Route path="/" element={<Home />} />

					{/* Protected Routes */}
					<Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
					<Route path="/myposts" element={<ProtectedRoute><MyPosts /></ProtectedRoute>} />
					<Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
					<Route path="/post-recipe" element={<ProtectedRoute><PostRecipe /></ProtectedRoute>} />
					<Route path='/edit-recipe/:id' element={<ProtectedRoute><EditRecipe /></ProtectedRoute>} />
					<Route path='/recipes/:id' element={<ProtectedRoute><RecipeDetails /></ProtectedRoute>} />
				</Routes>
			</div>
		</>
	)
}

export default App;
