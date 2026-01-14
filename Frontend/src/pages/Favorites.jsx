import { useEffect, useState, useContext } from "react";
import axios from "../config/axios";
import RecipeCard from "../components/recipeCard";
import UserContext from "../contexts/userContext";
import { useNavigate } from "react-router-dom";

function Favorites() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isLoggedIn } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/login");
            return;
        }

        const fetchFavorites = async () => {
            try {
                const res = await axios.get("/user/favorites", {
                    headers: { Authorization: localStorage.getItem("token") }
                });
                setFavorites(res.data);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        };

        fetchFavorites();
    }, [navigate]);

    if (loading) return <div className="p-10 pt-20 text-center">Loading your favorites...</div>;

    return (
        <main className="p-10 pt-20">
            <h1 className="text-3xl font-bold mb-8 italic text-amber-500 underline">My Favorites</h1>
            {favorites.length === 0 ? (
                <div className="text-center text-gray-500">You haven't added any favorites yet.</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {favorites.map((recipe) => (
                        <RecipeCard
                            onclick={() => navigate(`/recipe/${recipe._id}`)}
                            key={recipe._id}
                            recipes={recipe}
                        />
                    ))}
                </div>
            )}
        </main>
    );
}

export default Favorites;
