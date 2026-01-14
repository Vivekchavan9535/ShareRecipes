import RecipeForm from "../components/RecipeForm";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createRecipe } from "../slices/recipeSlice";
import { toast } from "react-toastify";
import { useContext } from "react";
import UserContext from "../contexts/userContext";

function PostRecipe() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { fetchAccount } = useContext(UserContext);

    const handleCreate = async (values) => {
        try {
            await dispatch(createRecipe(values)).unwrap();
            await fetchAccount(); // Refresh user state (posts count)
            toast.success("Recipe shared successfully!");
            navigate("/");
        } catch (error) {
            toast.error(error || "Failed to share recipe");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center">
            <RecipeForm onSubmit={handleCreate} />
        </div>
    )
}

export default PostRecipe;