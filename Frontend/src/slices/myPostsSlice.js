import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../config/axios";

export const fetchMyPosts = createAsyncThunk("recipes/fetchMyPosts", async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token")
        const res = await axios.get("/user/myposts", { headers: { Authorization: token } });
        return res.data
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || error.message)
    }
})

const myPostsSlice = createSlice({
    name: "MyPosts",
    initialState: {
        data: [],
        loading: true,
        serverError: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyPosts.pending, (state) => {
                state.loading = true;
                state.serverError = null
            })
            .addCase(fetchMyPosts.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.serverError = null
            })
            .addCase(fetchMyPosts.rejected, (state, action) => {
                state.loading = false;
                state.serverError = action.payload
            })
    }
})

export default myPostsSlice.reducer