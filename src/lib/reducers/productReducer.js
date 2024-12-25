// import {createAsyncThunk,createSlice} from "@reduxjs/toolkit";
// import axios from "axios";

// export const fetchProducts = createAsyncThunk('products/fetchProducts',
//         async(_,{rejectedWithValue})=>{
//                 try {
//                         const response = await axios.get('/api/products/')
//                         return response;
//                 } catch (error) {
//                         return rejectedWithValue(error.message)
//                 }
//         }
// )

// const categorySlice = createSlice({
//         name:"products",
//         initialState:{
//                 loading:false,
//                 categories:[],
//                 error:null,
//         },
//         extraReducers:(builder)=>{
//                 builder.addCase(fetchCategories.pending,(state)=>{
//                         state.loading = true;
//                 })
//                 .addCase(fetchCategories.fulfilled,(state,action)=>{
//                         state.loading = false;
//                         state.categories = action.payload;
//                         state.error = null;
//                 })
//                 .addCase(fetchCategories.rejected,(state,action)=>{
//                         state.loading = false;
//                         state.error = action.payload;
//                 })
//         }
// })
// export default categorySlice.reducer;

import {createAsyncThunk,createSlice} from "@reduxjs/toolkit";
import axios from "axios";

export const fetchfilteredProducts = createAsyncThunk('products/filter',
        async(productparams,{rejectedWithValue})=>{
                try {
                        const response = await axios.get('/api/products/filter',{
                                params:productparams
                        })
                        console.log(response.data)
                        return response.data;
                } catch (error) {
                        return rejectedWithValue(error.message)
                }
        }
)
export const fetchMorefiltered = createAsyncThunk('products/fetchmore',
        async(productparams,{rejectedWithValue})=>{
                try {
                        const response = await axios.get('/api/products/filter',{
                                params:productparams
                        })
                        console.log(response.data)
                        return response.data;
                } catch (error) {
                        return rejectedWithValue(error.message)
                }
        }
)

const productSlice = createSlice({
        name:"products",
        initialState:{
        product:null,
        products:[],
        isLoading:null,
        error:null,
        currentPage:null,
        totalPages:null,
        },
        extraReducers:(builder)=>{
                builder
                .addCase(fetchfilteredProducts.pending,(state)=>  {
                        state.error = null;
                        state.isLoading = true;
                       })
                .addCase(fetchfilteredProducts.fulfilled,(state,action)=> {
                        state.isLoading = false;
                        state.error = null;
                        state.products = state.products.length && action.payload.currentPage > 1 && action.payload.content.length?[...state.products,...action.payload.content]:action.payload.content;
                        state.currentPage = action.payload.currentPage;
                        state.totalPages = action.payload.totalPages;
                })
                .addCase(fetchfilteredProducts.rejected,(state)=>{
                        state.isLoading = false;
                })
            
                .addCase(fetchMorefiltered.fulfilled,(state,action)=> {
                        state.products = state.products.length && action.payload.currentPage > 1 && action.payload.content.length?[...state.products,...action.payload.content]:action.payload.content;
                        state.currentPage = action.payload.currentPage;
                        state.totalPages = action.payload.totalPages;
                })
        }
})
export default productSlice.reducer;