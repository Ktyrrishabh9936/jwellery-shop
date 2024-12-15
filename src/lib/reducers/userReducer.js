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

const userSlice = createSlice({
        name:"user",
        initialState:{
                loading:false,
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
        }
})
// export const {setUser} = userSlice.actions;
export default userSlice.reducer;