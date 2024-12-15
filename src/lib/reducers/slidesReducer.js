import {createAsyncThunk,createSlice} from "@reduxjs/toolkit";
import axios from "axios";
export const getHeroSlides = createAsyncThunk('slides/hero',
        async(_,{rejectedWithValue})=>{
                try {
                        const response = await axios.get('/api/slides/hero-slider')
                        return response.data.slides;            
                    } catch (error) {
                        console.log(error.message)
                        return rejectedWithValue(error.message)
                }
        }
)
export const getAboutSlides = createAsyncThunk('slides/about',
        async(_,{rejectedWithValue})=>{
                try {
                        const response = await axios.get('/api/slides/about-slider')
                        return response.data.slides;
                } catch (error) {
                        console.log(error.message)
                        return rejectedWithValue(error.message)
                }
        }
)


const slidebannerSlice = createSlice({
        name:"slides",
        initialState:{
                heroSlides:[],
                heroloading:false,
                isherofetched:false,
                heroFetcherror:null,
                aboutloading:false,
                aboutSlides:[],
                isaboutfetched:false,
                aboutFetcherror:null,
        },reducers:{
                // setUser:(state,action)=> {return({...state,user:action.payload})}
        },
        extraReducers:(builder)=>{
                builder.addCase(getHeroSlides.pending,(state)=>{
                        state.heroloading = true;
                })
                .addCase(getHeroSlides.fulfilled,(state,action)=>{
                        state.heroloading = false;
                        state.heroSlides = action.payload;
                        state.heroFetcherror = null;
                        state.isherofetched = true;
                })
                .addCase(getHeroSlides.rejected,(state,action)=>{
                        state.heroloading = false;
                        state.heroFetcherror = action.payload;
                }).addCase(getAboutSlides.pending,(state)=>{
                        state.aboutloading = true;
                })
                .addCase(getAboutSlides.fulfilled,(state,action)=>{
                        state.aboutloading = false;
                        state.aboutSlides = action.payload;
                        state.aboutFetcherror = null;
                        state.isaboutfetched = true;
                })
                .addCase(getAboutSlides.rejected,(state,action)=>{
                        state.aboutloading = false;
                        state.aboutFetcherror = action.payload;
                })
        }
})
export const {setUser} = slidebannerSlice.actions;
export default slidebannerSlice.reducer;