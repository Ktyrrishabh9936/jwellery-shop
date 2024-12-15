import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getUserProfile } from './userReducer.js';


export const getwishList = createAsyncThunk(
  'product/wishlist/getAll',
  async (_, { rejectWithValue }) => {
    try {
       const response = await axios.get(`/api/wishlist/`);
       console.log(response.data)
      return response.data.wishList;
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
       toast.success("item added To wishlist");
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

    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// Reducer slice
const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    loading:false,
    loadWishlist:null,
    wishListByID:[],
    wishlist:[],
  },
  reducers: {
    setItemsInWishlist:(state,action)=> {
      state.ItemsinWishlist = action.payload;
}
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.wishListByID = action.payload.wishList;
        state.error = null;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(AddwishList.pending, (state,action) => {
        state.loadWishlist = action.meta.arg;
      })
      .addCase(AddwishList.fulfilled, (state,action) => {
        state.loadWishlist = null;
        state.wishListByID =  state.wishListByID.length ? [...state.wishListByID,action.meta.arg] :[action.meta.arg];
        state.error = null;
      })
      .addCase(AddwishList.rejected, (state, action) => {
        state.loadWishlist = null;
        state.error = action.payload;
      })
      .addCase(getwishList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getwishList.fulfilled, (state,action) => {
        state.loading = false;
        state.wishlist = action.payload;
        state.error = null;
      })
      .addCase(getwishList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(RemovewishList.pending, (state,action) => {
        state.loadWishlist =  action.meta.arg;
      })
      .addCase(RemovewishList.fulfilled, (state,action) => {
        state.loadWishlist = null;
        state.wishListByID = state.wishListByID.filter((id)=> id !== action.meta.arg);
        state.wishlist = state.wishlist.filter((val)=>val._id !== action.meta.arg);
        state.error = null;
      })
      .addCase(RemovewishList.rejected, (state, action) => {
        state.loadWishlist = null;
        state.error = action.payload;
      })
  },
});
export const {setItemsInWishlist} = wishlistSlice.actions;
export default wishlistSlice.reducer;