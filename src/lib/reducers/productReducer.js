import {createAsyncThunk,createSlice} from "@reduxjs/toolkit";
import axios from "axios";

export const fetchProducts = createAsyncThunk('products/fetchProducts',
        async(_,{rejectedWithValue})=>{
                try {
                        const response = await axios.get('/api/products/')
                        return response;
                } catch (error) {
                        return rejectedWithValue(error.message)
                }
        }
)

const categorySlice = createSlice({
        name:"products",
        initialState:{
                loading:false,
                categories:[],
                error:null,
        },
        extraReducers:(builder)=>{
                builder.addCase(fetchCategories.pending,(state)=>{
                        state.loading = true;
                })
                .addCase(fetchCategories.fulfilled,(state,action)=>{
                        state.loading = false;
                        state.categories = action.payload;
                        state.error = null;
                })
                .addCase(fetchCategories.rejected,(state,action)=>{
                        state.loading = false;
                        state.error = action.payload;
                })
        }
})
export default categorySlice.reducer;