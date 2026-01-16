import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { fetchRecipes, searchRecipes } from "../slices/recipeSlice";

function SearchInput() {
    const [searchText, setSearchText] = useState("");
    const dispatch = useDispatch();

    const [searchParams] = useSearchParams();
    const category = searchParams.get("category") || "All";

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchText.trim()) {
                dispatch(searchRecipes(searchText.trim()));
            } else {
                if (category === "All") {
                    dispatch(fetchRecipes());
                }
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchText, category, dispatch]);

    return (
        <main className="w-full flex flex-col justify-center gap-5">
            <input
                className="h-10 w-full border-white border rounded-full px-6 text-lg shadow-lg outline-0 bg-white/10 text-white placeholder-gray-400"
                type="search"
                placeholder="Search recipes..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
            />
        </main>
    );
}

export default SearchInput;
