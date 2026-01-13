import { configureStore } from "@reduxjs/toolkit";
import recipesSlice from "../slices/recipeSlice";

const store = configureStore({
    reducer: {
        recipes: recipesSlice
    }
})

export default store