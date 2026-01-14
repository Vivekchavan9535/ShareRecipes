import { useNavigate } from "react-router-dom";
import RecipeCard from "../components/recipeCard";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";


function RecipesConatiner() {
    const { data } = useSelector((state) => {
        return state.recipes;
    })

    const navigate = useNavigate()

    const handleNavigate = (id) => {
        if (localStorage.getItem("token")) {
            navigate(`/recipe/${id}`)
        } else {
            toast("Please Login to See Recipe")
            navigate("/login")
        }
    }

    return (
        <main className="p-10 pt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data?.map((recipe) => (
                <RecipeCard onclick={() => handleNavigate(recipe._id)} key={recipe._id} recipes={recipe} />
            ))}
        </main>
    )
}

export default RecipesConatiner;