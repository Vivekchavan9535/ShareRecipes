import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import RecipeForm from "../components/RecipeForm";
import { updateRecipe } from "../slices/recipeSlice";
import { toast } from "react-toastify";

function EditRecipe() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const recipe = useSelector((state) =>
        state.recipes.data.find((r) => r._id === id)
    );

    if (!recipe) {
        return <div className="p-10 text-center">Recipe not found!</div>;
    }

    const handleUpdate = async (values) => {
        try {
            await dispatch(updateRecipe({ id, formData: values })).unwrap();
            toast.success("Recipe updated successfully!");
            navigate(`/recipe/${id}`);
        } catch (error) {
            toast.error(error || "Failed to update recipe");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center py-10">
            <RecipeForm
                title="Edit Your Recipe"
                buttonText="Update Recipe"
                initialValues={recipe}
                onSubmit={handleUpdate}
            />
        </div>
    );
}

export default EditRecipe;
