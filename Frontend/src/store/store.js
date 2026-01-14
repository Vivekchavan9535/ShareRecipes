import { configureStore } from "@reduxjs/toolkit";
import recipesSlice from "../slices/recipeSlice";
import myPostsSlice from "../slices/myPostsSlice";

const store = configureStore({
    reducer: {
        recipes: recipesSlice,
        myPosts: myPostsSlice
    }
})

export default store