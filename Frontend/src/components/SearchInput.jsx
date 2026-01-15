import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom"; // Added useLocation
import { fetchRecipes, searchRecipes } from "../slices/recipeSlice";

function SearchInput() {
    const [searchText, setSearchText] = useState("");

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchText.trim()) {
                dispatch(searchRecipes(searchText.trim()));
            } else {
                dispatch(fetchRecipes());
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchText, dispatch]);

    const handleChange = (e) => {
        setSearchText(e.target.value);
    };

    const handleClear = () => {
        setSearchText("");
        dispatch(fetchRecipes());
    };

    return (
        <main className="w-full flex flex-col justify-center gap-5">
            <input
                className="h-10 w-full border-white border rounded-full px-6 text-lg shadow-lg outline-0 bg-white/10 text-white placeholder-gray-400"
                type="search"
                placeholder="Search recipes..."
                value={searchText}
                onChange={handleChange}

            />
        </main>
    );
}

export default SearchInput;