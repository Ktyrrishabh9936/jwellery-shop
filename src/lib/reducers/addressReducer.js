import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

// Async thunks for API requests
export const fetchAddresses = createAsyncThunk('address/fetchAddresses', async (_, { rejectWithValue }) => {
    try {
       const response = await axios.get(`/api/users/address`);
       console.log(response.data)
      return response.data.address;
    } catch (error) {
      return rejectWithValue(error.message);
    }
});

export const addAddress = createAsyncThunk('address/addAddress', async (address, { rejectWithValue }) => {
  try {
    const response = await axios.post('/api/users/address', address);
    toast.success("Add Address sucesss")
    console.log(response.data)
    return response.data.address;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const updateAddress = createAsyncThunk('address/updateAddress', async (address, { rejectWithValue }) => {
  try {
    const response = await axios.put(`/api/users/address`, address);
    return  response.data.address;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const deleteAddress = createAsyncThunk('address/deleteAddress', async (id, { rejectWithValue }) => {
  try {
    console.log(id)
    await axios.delete(`/api/users/address/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Initial state
const initialState = {
  addresses: [],
  loading: false,
  error: null,
};

// Address slice
const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses.push(action.payload);
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.addresses.findIndex((address) => address._id === action.payload._id);
        if (index !== -1) {
          state.addresses[index] = action.payload;
        }
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = state.addresses.filter((address) => address._id !== action.payload);
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default addressSlice.reducer;