import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useContext, useState } from "react";
import UserContext from "../contexts/userContext";
import { deleteRecipe } from "../slices/recipeSlice";
import { toast } from "react-toastify";
import axios from "../config/axios";
import Rate from "../components/Rate";

function RecipeDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, fetchAccount } = useContext(UserContext);
    const dispatch = useDispatch()

    const recipe = useSelector((state) =>
        state.recipes.data.find((r) => r._id === id)
    );

    if (!recipe) {
        return <div className="p-10 text-center">Recipe not found!</div>;
    }

    const isOwner = user && (
        recipe.createdBy?._id === user._id ||
        recipe.createdBy === user._id
    );

    const isFavorite = user?.favorites?.includes(recipe._id);

    const handleDelete = async (id) => {
        try {
            await dispatch(deleteRecipe(id)).unwrap()
            await fetchAccount();
            toast("Successfully deleted")
            navigate("/myposts")
        } catch (error) {
            toast(error)
        }
    }

    const toggleFavorite = async () => {
        try {
            const res = await axios.put(`/user/favorites/${recipe._id}`, {}, {
                headers: { Authorization: localStorage.getItem("token") }
            });
            await fetchAccount();
            toast.success(res.data.message);
        } catch (error) {
            toast.error(error.response?.data?.error || "Error updating favorites");
        }
    };

    const userRating = recipe.ratings?.find(r => r.user === user?._id)?.value || 0;

    return (
        <main className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            {/* Header Section */}
            <div className="border-b pb-4 mb-6 flex justify-between items-start">
                <div className="flex-1">
                    <div className="flex items-center gap-4">
                        <h1 className="text-3xl font-bold text-slate-900">{recipe.title}</h1>
                        <div className="flex items-center gap-2">
                            {user && !isOwner && (
                                <button
                                    onClick={toggleFavorite}
                                    className={`text-2xl transition-transform hover:scale-110`}
                                    title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                                >
                                    {isFavorite ? <span className="bg-rose-50 text-rose-600 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-1 border border-rose-100">Remove from Favorites</span> : <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-1 border border-emerald-100">Add to Favorites</span>}
                                </button>
                            )}
                            {recipe.avgRating > 0 && (
                                <span className="bg-amber-50 text-amber-700 px-2 py-1 rounded-md text-xs font-black uppercase tracking-tighter flex items-center gap-1">
                                    ⭐ {recipe.avgRating} ({recipe.ratingsCount})
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 mt-2">
                        <p className="text-gray-600 text-sm font-medium flex items-center gap-1">
                            <span className="text-gray-400">👤 Shared by:</span>
                            {isOwner ? "You" : (recipe.createdBy?.username || "Unknown")}
                        </p>
                        <p className="text-gray-500 text-sm">{recipe.description}</p>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                    {user && !isOwner && <Rate recipe={recipe} userRating={userRating} />}
                    {isOwner && (
                        <div className="flex gap-3">
                            <button
                                onClick={() => navigate(`/edit-recipe/${id}`)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md active:scale-95"
                            >
                                Edit Recipe
                            </button>

                            <button
                                onClick={() => handleDelete(id)}
                                className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-bold transition-colors"
                            >
                                Delete Recipe
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Image Section */}
            <img
                src={recipe.img || "https://via.placeholder.com/800x400"}
                alt={recipe.title}
                className="w-full h-80 object-cover rounded-md mb-8"
            />

            {/* Details Grid (Time, Level, etc) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 bg-gray-50 p-4 rounded-md">
                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase">Time</h3>
                    <p className="font-semibold">{recipe.time} mins</p>
                </div>
                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase">Servings</h3>
                    <p className="font-semibold">{recipe.servings} people</p>
                </div>
                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase">Difficulty</h3>
                    <p className="font-semibold capitalize">{recipe.level}</p>
                </div>
                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase">Category</h3>
                    <p className="font-semibold">{recipe.category}</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
                {/* Ingredients */}
                <div>
                    <h2 className="text-xl font-black mb-4 border-l-4 border-emerald-500 pl-3 uppercase tracking-tight text-slate-800">Ingredients</h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        {recipe.ingredients.map((ing, i) => (
                            <li key={i}>{ing}</li>
                        ))}
                    </ul>
                </div>

                {/* Instructions */}
                <div>
                    <h2 className="text-xl font-black mb-4 border-l-4 border-emerald-500 pl-3 uppercase tracking-tight text-slate-800">Instructions</h2>
                    <div className="space-y-4">
                        {recipe.instructions.map((step, i) => (
                            <div key={i} className="flex gap-3">
                                <span className="font-bold text-yellow-500">{i + 1}.</span>
                                <p className="text-gray-700">{step}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main >
    );
}

export default RecipeDetails;