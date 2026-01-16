import { useSelector } from "react-redux"
import RecipeCard from "../components/RecipeCard"
import UserContext from "../contexts/userContext"
import { useNavigate } from "react-router-dom"
import { useContext } from "react"

function MyPosts() {
    const { data, loading, serverError } = useSelector((state) => state.myPosts)
    const { isLoggedIn } = useContext(UserContext)
    const navigate = useNavigate()

    if (loading) return <div className="p-10 pt-20 text-center">Loading your recipes...</div>
    if (serverError) return <div className="p-10 pt-20 text-center text-red-500">{serverError}</div>
    return (
        <main className="p-10 pt-20">
            <h1 className="text-3xl font-bold mb-8">My Recipes</h1>
            {data.length === 0 ? (
                <div className="text-center text-gray-500">You haven't posted any recipes yet.</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {data.map((recipe) => (
                        <RecipeCard key={recipe._id} recipes={recipe} />
                    ))}
                </div>
            )}
        </main>
    )
}

export default MyPosts;