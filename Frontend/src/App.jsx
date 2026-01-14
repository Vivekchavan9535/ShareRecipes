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


function App() {
	const { isLoggedIn } = useContext(UserContext)
	const dispatch = useDispatch()


	useEffect(() => {
		dispatch(fetchRecipes())
		if (isLoggedIn) {
			dispatch(fetchMyPosts())
		}
	}, [dispatch, isLoggedIn])


	return (
		<>
			<ToastContainer />
			<Navbar />
			<div className="pt-20">

				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="/signup" element={<Signup />} />
					<Route path="/" element={<Home />} />
					<Route path="/profile" element={<Profile />} />
					<Route path="/myposts" element={<MyPosts />} />
					<Route path="/favorites" element={<Favorites />} />
					<Route path="/post-recipe" element={<PostRecipe />} />
					<Route path='/recipe/:id' element={<RecipeDetails />} />
					<Route path='/edit-recipe/:id' element={<EditRecipe />} />
				</Routes>
			</div>
		</>
	)
}

export default App;
