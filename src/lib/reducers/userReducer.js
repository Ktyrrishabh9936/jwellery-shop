import {createAsyncThunk,createSlice} from "@reduxjs/toolkit";
import axios from "axios";

export const getUserProfile = createAsyncThunk('users/getProfile',
        async(_,{rejectedWithValue})=>{
                try {
                        const response = await axios.get('/api/users/profile')
                        console.log(response.data.userData)
                        return response.data.userData;
                } catch (error) {
                        return rejectedWithValue(error.message)
                }
        }
)


export const updateProfile = createAsyncThunk('user/updateProfile', async (data, { rejectWithValue }) => {
  try {
    const response = await axios.put('/api/users/profile', data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const updateImage = createAsyncThunk('user/updateImage', async (image, { rejectWithValue }) => {
  try {
    const response = await axios.put('/api/users/updateImage', {image});
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const userSlice = createSlice({
        name:"user",
        initialState:{
                loading:false,
                updateprofileloading:false,
                savechangeloading:false,
                user:null,
                error:null,
                address:[],
        },
      
        extraReducers:(builder)=>{
                builder.addCase(getUserProfile.pending,(state)=>{
                        state.loading = true;
                })
                .addCase(getUserProfile.fulfilled,(state,action)=>{
                        state.loading = false;
                        state.user = action.payload;
                        state.address = action.payload.addresses;
                        state.error = null;
                })
                .addCase(getUserProfile.rejected,(state,action)=>{
                        state.loading = false;
                        state.error = action.payload;
                })
                .addCase(updateProfile.pending, (state) => {
                        state.updateprofileloading = true;
                        state.error = null;
                      })
                      .addCase(updateProfile.fulfilled, (state, { payload }) => {
                        state.updateprofileloading = false;
                        state.user.name = payload.name;
                        state.user.phone = payload.phone;
                      })
                      .addCase(updateProfile.rejected, (state, { payload }) => {
                        state.updateprofileloading = false;
                        state.error = payload;
                      })
                      .addCase(updateImage.pending, (state) => {
                        state.savechangeloading = true;
                        state.error = null;
                      })
                      .addCase(updateImage.fulfilled, (state, { payload }) => {
                        state.savechangeloading = false;
                        state.user.image = payload.image;
                      })
                      .addCase(updateImage.rejected, (state, { payload }) => {
                        state.savechangeloading = false;
                        state.error = payload;
                      });
        }
})
// export const {setUser} = userSlice.actions;
export default userSlice.reducer;