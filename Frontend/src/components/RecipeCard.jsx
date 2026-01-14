import { useContext } from "react";
import UserContext from "../contexts/userContext";

const url = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"


function RecipeCard({ recipes, onclick }) {
	const { user } = useContext(UserContext);

	// Determine creator name
	const creatorId = typeof recipes.createdBy === 'object' ? recipes.createdBy?._id : recipes.createdBy;
	const creatorName = typeof recipes.createdBy === 'object' ? recipes.createdBy?.username : null;

	const displayName = (user && user._id === creatorId) ? "You" : (creatorName || "Unknown");

	return (
		<main onClick={() => onclick()} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group">

			<section className="h-48 w-full bg-gray-200 overflow-hidden relative">

				<img
					src={recipes.img || url}
					alt={recipes.title}
					className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
				/>
				<div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
					<span className="bg-white text-orange-500 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
						{recipes.category}
					</span>
					{user?.favorites?.includes(recipes._id) && (
						<span className="bg-white p-1 rounded-full shadow-sm text-red-500 text-xs">❤️</span>
					)}
				</div>
			</section>

			<section className="p-4">
				<div className="flex justify-between items-start mb-2">
					<h2 className="text-xl font-bold text-gray-800 line-clamp-1 group-hover:text-orange-500 transition-colors">
						{recipes.title}
					</h2>
				</div>

				<div className="flex items-center gap-2 mb-3">
					<span className="text-gray-400 text-xs">👤</span>
					<p className="text-gray-600 text-sm font-medium">
						{displayName}
					</p>
				</div>

				<p className="text-gray-500 text-sm mb-4 line-clamp-2">
					{recipes.description}
				</p>

				<div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
					<div className="flex items-center gap-2 text-gray-600 text-sm">
						<span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded text-xs capitalize">
							{recipes.level}
						</span>
						<span>•</span>
						<span>{recipes.time} min</span>
					</div>
					<div className="flex items-center gap-1 text-sm font-semibold">
						{Array.from({ length: 5 }, (_, index) => (
							<span key={index} className={index < Math.round(recipes.avgRating || 0) ? "text-yellow-500" : "text-gray-300"}>★</span>
						))}
						<span className="text-gray-600 ml-1">({recipes.avgRating?.toFixed(1) || 0})</span>
					</div>
				</div>
			</section>
		</main>
	)
}

export default RecipeCard;