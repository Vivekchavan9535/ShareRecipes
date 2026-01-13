import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axios";


export const fetchRecipes = createAsyncThunk("recipes/fetchRecipes", async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get("/recipes")
        return res.data
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || "Something went wrong")
    }
})


const recipes = createSlice({
    name: "recipes",
    initialState: {
        data: [],
        loading: true,
        serverError: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRecipes.pending, (state) => {
                state.loading = true;
                state.serverError = null
            })
            .addCase(fetchRecipes.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchRecipes.rejected, (state, action) => {
                state.loading = false;
                state.serverError = action.payload;
            })
    }

})

export default recipes.reducer;