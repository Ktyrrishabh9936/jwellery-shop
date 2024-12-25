import {createAsyncThunk,createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../config.js";
export const fetchCategories = createAsyncThunk('categories/all',
        async(_,{rejectedWithValue})=>{
                try {
                        const response = await axios.get('/api/categories')
                        console.log(response.data)
                        return response.data;
                } catch (error) {
                        return rejectedWithValue(error.message)
                }
        }
)

export const addCategory = createAsyncThunk(
        'categories/addCategory',
        async (categoryData, { rejectWithValue }) => {
          try {
            const response = await axios.post(`${baseUrl}/categories`, categoryData);
            return response.data;
          } catch (error) {
            return rejectWithValue(error.message);
          }
        }
      );
      // Dev Pulse Studio
      
      // Async thunk action creator to delete a category
      export const deleteCategory = createAsyncThunk(
        'categories/deleteCategory',
        async (categoryId, { rejectWithValue }) => {
          try {
            await axios.delete(`${baseUrl}/categories/${categoryId}`);
            return categoryId;
          } catch (error) {
            return rejectWithValue(error.message);
          }
        }
      );
      
      // Async thunk action creator to update a category
      export const updateCategory = createAsyncThunk(
        'categories/updateCategory',
        async ({ categoryId, categoryData }, { rejectWithValue }) => {
          try {
            const response = await axios.put(`${baseUrl}/categories/${categoryId}`, categoryData);
            return response.data;
          } catch (error) {
            return rejectWithValue(error.message);
          }
        }
      );

const categorySlice = createSlice({
        name:"categories",
        initialState:{
                loading:false,
                categories:[],
                isfetched:false,
                error:null,
        },
        extraReducers:(builder)=>{
                builder.addCase(fetchCategories.pending,(state)=>{
                        state.loading = true;
                        state.error = null;
                })
                .addCase(fetchCategories.fulfilled,(state,action)=>{
                        state.loading = false;
                        state.categories = action.payload;
                        state.isfetched = true;
                        state.error = null;
                })
                .addCase(fetchCategories.rejected,(state,action)=>{
                        state.loading = false;
                        state.error = action.payload;
                }).addCase(addCategory.pending, (state) => {
                        state.loading = true;
                      })
                      .addCase(addCategory.fulfilled, (state, action) => {
                        state.loading = false;
                        state.categories.push(action.payload);
                        state.error = null;
                      })
                      .addCase(addCategory.rejected, (state, action) => {
                        state.loading = false;
                        state.error = action.payload;
                      })
                      .addCase(deleteCategory.pending, (state) => {
                        state.loading = true;
                      })
                      .addCase(deleteCategory.fulfilled, (state, action) => {
                        state.loading = false;
                        state.categories = state.categories.filter(category => category._id !== action.payload);
                        state.error = null;
                      })
                      .addCase(deleteCategory.rejected, (state, action) => {
                        state.loading = false;
                        state.error = action.payload;
                      })
                      .addCase(updateCategory.pending, (state) => {
                        state.loading = true;
                      })
                      .addCase(updateCategory.fulfilled, (state, action) => {
                        state.loading = false;
                        const updatedIndex = state.categories.findIndex(category => category._id === action.payload._id);
                        if (updatedIndex !== -1) {
                          state.categories[updatedIndex] = action.payload;
                        }
                        state.error = null;
                      })
                      .addCase(updateCategory.rejected, (state, action) => {
                        state.loading = false;
                        state.error = action.payload;
                      });
        }
})
export default categorySlice.reducer;