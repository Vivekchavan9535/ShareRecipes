import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axios";
import { fetchMyPosts } from "./myPostsSlice";



export const fetchRecipes = createAsyncThunk("recipes/fetchRecipes", async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get("/recipes")
        return res.data
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || "Something went wrong")
    }
})

export const searchRecipes = createAsyncThunk("recipes/searchRecipes", async (query, { rejectWithValue }) => {
    try {
        const res = await axios.get(`/recipes/search?q=${query}`)
        return res.data
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || "Something went wrong")
    }
})


export const createRecipe = createAsyncThunk("recipes/createRecipe", async (formData, { rejectWithValue, dispatch }) => {
    try {
        const token = localStorage.getItem("token")
        const res = await axios.post("/recipes", formData, { headers: { Authorization: token } })
        dispatch(fetchRecipes())
        dispatch(fetchMyPosts())
        return res.data
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || "Failed to create recipe")
    }
})

export const updateRecipe = createAsyncThunk("recipes/updateRecipe", async ({ id, formData }, { rejectWithValue, dispatch }) => {
    try {
        const token = localStorage.getItem("token")
        const res = await axios.put(`/recipes/${id}`, formData, { headers: { Authorization: token } })
        dispatch(fetchMyPosts())
        dispatch(fetchRecipes())
        return res.data
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || "Failed to update recipe")
    }
})


export const deleteRecipe = createAsyncThunk("recipes/deleteRecipe", async (id, { rejectWithValue, dispatch }) => {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.delete(`/recipes/${id}`, { headers: { Authorization: token } })
        dispatch(fetchMyPosts())
        dispatch(fetchRecipes())
        return res.data
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || "Failed to delete recipe")
    }
})

export const rateRecipe = createAsyncThunk("recipes/rateRecipe", async ({ id, value }, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token")
        const res = await axios.put(`/recipes/${id}/rating`, { value }, { headers: { Authorization: token } })
        return res.data
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || "Failed to submit rating")
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
            .addCase(searchRecipes.pending, (state) => {
                state.loading = true;
                state.serverError = null;
            })
            .addCase(searchRecipes.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(searchRecipes.rejected, (state, action) => {
                state.loading = false;
                state.serverError = action.payload;
            })
            .addCase(createRecipe.fulfilled, (state, action) => {
                state.data.unshift(action.payload)
            })
            .addCase(updateRecipe.fulfilled, (state, action) => {
                const index = state.data.findIndex(r => r._id === action.payload._id)
                state.data[index] = action.payload
            })
            .addCase(deleteRecipe.fulfilled, (state, action) => {
                const index = state.data.findIndex(r => r._id === action.payload._id)
                state.data.splice(index, 1)
            })
            .addCase(rateRecipe.fulfilled, (state, action) => {
                const index = state.data.findIndex(r => r._id === action.payload._id)
                if (index !== -1) {
                    state.data[index] = action.payload
                }
            })
    }
})

export default recipes.reducer;