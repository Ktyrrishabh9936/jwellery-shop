import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseUrl } from '../config.js';
import toast from 'react-hot-toast';
import { getUserProfile } from './userReducer.js';

// Async thunk action creator
export const fetchProduct = createAsyncThunk(
  'product/fetchProduct',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseUrl}/products/${productId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const AddwishList = createAsyncThunk(
  'product/wishlist/add',
  async (productId, { rejectWithValue }) => {
    try {
       await axios.post(`/api/wishlist/add`,{productId});
      return toast.success("Item Added To wishlist");
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const RemovewishList = createAsyncThunk(
  'product/wishlist/remove',
  async (productId, { rejectWithValue }) => {
    try {
       await axios.post(`/api/wishlist/remove`,{productId});
      return toast.success("Item Removed from wishlist");
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// Reducer slice
const productSlice = createSlice({
  name: 'product',
  initialState: {
    loadWishlistAdd:false,
    wishlist:null,
    loading: false,
    product: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
        state.error = null;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(AddwishList.pending, (state) => {
        state.loadWishlistAdd = true;
      })
      .addCase(AddwishList.fulfilled, (state) => {
        state.loadWishlistAdd = false;
        state.error = null;
      })
      .addCase(AddwishList.rejected, (state, action) => {
        state.loadWishlistAdd = false;
        state.error = action.payload;
      }).addCase(getUserProfile.pending, (state) => {
        state.loadWishlistAdd = true;
      })
      .addCase(getUserProfile.fulfilled, (state,action) => {
        state.loadWishlistAdd = false;
        state.wishlist = action.payload.wishList;
        state.error = null;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loadWishlistAdd = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;