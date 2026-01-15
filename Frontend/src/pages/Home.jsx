import { useContext, useEffect, useState } from "react";
import RecipesContainer from "./RecipesContainer";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import UserContext from "../contexts/userContext";
import { fetchRecipes, searchRecipes } from "../slices/recipeSlice";



function Home() {
	const [category, setCategory] = useState("");

	const categories = ["All", "Breakfast", "Lunch", "Dinner", "Snack", "Dessert"];

	const { isLoggedIn } = useContext(UserContext)
	const dispatch = useDispatch()
	const navigate = useNavigate()




	useEffect(() => {
		if (category && category !== "All") {
			dispatch(searchRecipes(category));
		} else {
			dispatch(fetchRecipes());
		}
	}, [category, dispatch]);

	const handleShareRecipe = () => {
		if (isLoggedIn) {
			navigate('/post-recipe')
		} else {
			toast.error("Please login to share your recipe", {
				position: "top-center",
				autoClose: 2000,
				theme: "dark",
			});
			navigate('/login')
		}
	}




	return (
		<main>
			<button onClick={handleShareRecipe} className="bg-yellow-400 hover:bg-yellow-500 transition-colors text-black font-semibold px-6 py-2 mt-5 ml-10 rounded-full shadow-md">
				Share Your Recipe
			</button>

			<select onChange={(e) => { const value = e.target.value; if (value !== "") { setCategory(value) } }}
				value={category || ""} className="bg-yellow-400 hover:bg-yellow-500 transition-colors text-black font-semibold px-6 py-2 mt-5 ml-10 rounded-full shadow-md">
				<option value="" disabled>Filter By</option>
				{categories.map((c, i) => {
					return <option key={i} value={c}>{c}</option>
				})}
			</select>

			<RecipesContainer />
		</main>
	);
}

export default Home;