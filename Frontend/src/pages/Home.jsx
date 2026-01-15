import { useContext } from "react";
import RecipesContainer from "./RecipesContainer";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import UserContext from "../contexts/userContext";



function Home() {
	const { isLoggedIn } = useContext(UserContext)
	const dispatch = useDispatch()
	const navigate = useNavigate()

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
			<button
				onClick={handleShareRecipe}
				className="bg-yellow-400 hover:bg-yellow-500 transition-colors text-black font-semibold px-6 py-2 mt-5 ml-10 rounded-full shadow-md"
			>
				Share Your Recipe
			</button>
			<RecipesContainer />
		</main>
	);
}

export default Home;