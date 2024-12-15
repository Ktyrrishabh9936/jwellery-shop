import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';


export const getAddress = createAsyncThunk(
  'address/getUser',
  async (_, { rejectWithValue }) => {
    try {
       const response = await axios.get(`/api/users/address`);
       console.log(response.data)
      return response.data.address;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const RemoveAddress = createAsyncThunk(
  'address/remove',
  async (addressId, { rejectWithValue }) => {
    try {
       await axios.post(`/api/wishlist/remove`,{addressId});
       return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// Reducer slice
const addressSlice = createSlice({
  name: 'address',
  initialState: {
    loadingAddress:null,
    address:[],   
    error:null,
  },
  reducers: {  },
  extraReducers: (builder) => {
    builder
         .addCase(getAddress.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAddress.fulfilled, (state,action) => {
        state.loading = false;
        state.address = action.payload;
        state.error = null;
      })
      .addCase(getAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(RemoveAddress.pending, (state,action) => {
        state.loadingAddress = action.meta.arg;
      })
      .addCase(RemoveAddress.fulfilled, (state,action) => {
        state.loadingAddress = null;
        state.address = state.address.filter((val)=> val._id=== action.meta.arg);
        state.error = null;
      })
      .addCase(RemoveAddress.rejected, (state, action) => {
        state.loadingAddress = null;
        state.error = action.payload;
      })
  },
});
export default addressSlice.reducer;