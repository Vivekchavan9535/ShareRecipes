import RecipeCard from "../components/recipeCard";
import { useSelector } from "react-redux";


function RecipesConatiner() {
    const { data } = useSelector((state) => {
        return state.recipes;
    })



    return (
        <main className="p-10 pt-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data?.map((recipe) => (
                <RecipeCard key={recipe._id} recipes={recipe} />
            ))}
        </main>
    )
}

export default RecipesConatiner;