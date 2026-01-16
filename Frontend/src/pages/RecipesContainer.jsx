import { useNavigate, useLocation } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { fetchRecipes, searchRecipes } from "../slices/recipeSlice";

function RecipesConatiner() {
    const { data, loading, serverError } = useSelector((state) => state.recipes);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();



    const handleNavigate = (id) => {
        const detailsPath = `/recipes/${id}`;
        if (localStorage.getItem("token")) {
            navigate(detailsPath)
        } else {
            toast("Please Login to See Recipe")
            navigate(`/login?redirect=${encodeURIComponent(detailsPath)}`)
        }
    }

    if (loading) {
        return <div className="p-10 text-center">Loading recipes...</div>;
    }

    if (serverError) {
        return <div className="p-10 text-center text-red-500">{serverError}</div>;
    }

    return (
        <main className="p-10 pt-10">
            {data.length === 0 && <h1 className="text-2xl font-semibold">No Result Found</h1>}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {data.map((recipe) => (
                    <RecipeCard key={recipe._id} recipes={recipe} />
                ))}
            </div>
        </main>
    )
}

export default RecipesConatiner;