import {createAsyncThunk,createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

export const fetchCart = createAsyncThunk('cart/fetch',
        async(_,{rejectedWithValue})=>{
                try {
                        const response = await axios.get('/api/cart')
                        console.log(response.data)
                        if(response.data.successType == "EMPTY"){
                                return {totalItem:0}
                        }else{
                        return response.data.cart;
                }
                } catch (error) {
                       
                        return rejectedWithValue(error.message)
                }
        }
)
export const getCartByApplyCoupon = createAsyncThunk('cart/applyCopuon',
        async(couponCode,{rejectedWithValue})=>{
                try {
                        const response = await axios.post('/api/cart/price',{couponCode})
                        console.log(response.data)
                        return response.data;
                } catch (error) {
                        return rejectedWithValue(error.message)
                }
        }
)
export const addToCart = createAsyncThunk('cart/add',
        async(data,{rejectedWithValue})=>{
                try {
                        const response = await axios.post('/api/cart/add',data);
                        console.log(response.data)
                        toast.success("Product added to cart!");

                        return response.data;
                } catch (error) {
                        return rejectedWithValue(error.message)
                }
        }
)
export const removefromCart = createAsyncThunk('cart/remove',
        async(productId,{rejectedWithValue})=>{
                try {
                        const response = await axios.post('/api/cart/remove',{productId})
                        console.log(response.data)
                        return response.data;
                } catch (error) {
                        return rejectedWithValue(error.message)
                }
        }
)
const calculateTotals = (items) => {
  let totalPrice=0;
  let totalDiscountedPrice=0;
  let totalItem=0;
  let discounte=0;
  items.forEach((item) => {
    totalPrice += item.price * item.quantity;
    totalItem+=item.quantity;
    totalDiscountedPrice += item.discountedPrice * item.quantity;
    discounte += totalPrice - totalDiscountedPrice;
  });
 
  return { discounte,totalPrice, totalDiscountedPrice, totalItem };
};
const initialState = {
        openSideCart:false,
        loadingProductId:null,
        loadingRemoveProduct:null,
        totalItem:0,
        Items:[],
        totalPrice:0,
        discounte:0,
        totalDiscountedPrice:0,
        
        loading: false,
        error: null,
        isFetched:false,
        // items: typeof window !== "undefined" ? JSON.parse(localStorage.getItem("cart") || "[]") : [],
      };
      
      const cartSlice = createSlice({
        name: "cart",
        initialState,
        reducers: {
          setTotalItem:(state,action)=>{
            state.totalItem = action.payload;
          },
          setsidebarCart: (state,action) => {
            state.openSideCart = action.payload;
          },
          addItem: (state, action) => {
            const existingItem = state.items.find((item) => item.id === action.payload.id);
            if (existingItem) {
              existingItem.quantity += action.payload.quantity;
            } else {
              state.items.push(action.payload);
            }
            localStorage.setItem("cart", JSON.stringify(state.items));
          },
          removeItem: (state, action) => {
            state.items = state.items.filter((item) => item.id !== action.payload);
            localStorage.setItem("cart", JSON.stringify(state.items));
          },
          clearCart: (state) => {
            localStorage.removeItem("cart");
            return {...state, openSideCart:false,
              loadingProductId:null,
              loadingRemoveProduct:null,
              totalItem:0,
              Items:[],
              totalPrice:0,
              discounte:0,
              totalDiscountedPrice:0,
              
              loading: false,
              error: null,
              isFetched:false,};
          },
          setLoggedIn: (state, action) => {
            state.isLoggedIn = action.payload;
          },
          syncCart: (state, action) => {
            state.items = action.payload;
            localStorage.setItem("cart", JSON.stringify(state.items));
          },
        },
        extraReducers: (builder) => {
          builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.Items = action.payload.items;
        state.totalItem = action.payload.totalItem;
        state.totalPrice = action.payload.totalPrice;
        state.discounte = action.payload.discounte;
        state.totalDiscountedPrice = action.payload.totalDiscountedPrice;
        state.error = null;
        state.isFetched = true;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToCart.pending, (state,action) => {
        state.loading = true;
        state.loadingProductId = action.meta.arg.productId;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
       
        let data ;
        if(action.payload.isExist){
          const idx = state.Items.findIndex((val)=>val.productId === action.meta.arg.productId);
            console.log(idx)
          state.Items[idx] = action.payload.item;
          data=state.Items;
        }
        else{
          data = state.Items? [...state.Items,action.payload.item] : [action.payload.item]
        }
        state.Items = data;
        const { discounte,totalPrice, totalDiscountedPrice, totalItem } = calculateTotals(data);
        state.totalItem = totalItem;
        state.totalPrice = totalPrice;
        state.discounte = discounte;
        state.totalDiscountedPrice = totalDiscountedPrice;
        state.loadingProductId = null;
        state.error = null;
        state.loading = false;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.loadingProductId = null;
      })
      .addCase(removefromCart.pending, (state,action) => {
        state.loadingRemoveProduct = action.meta.arg;
        
      })
      .addCase(removefromCart.fulfilled, (state, action) => {
        const data = state.Items.filter((val)=>val.productId !== action.meta.arg);
        state.Items = data;
        const { discounte,totalPrice, totalDiscountedPrice, totalItem } = calculateTotals(data);
        state.totalItem = totalItem;
        state.totalPrice = totalPrice;
        state.discounte = discounte;
        state.totalDiscountedPrice = totalDiscountedPrice;
        state.loadingRemoveProduct = null;
        state.error = null;
      })
      .addCase(removefromCart.rejected, (state, action) => {
        state.loadingRemoveProduct = null;
        state.error = action.payload;
      })
        },
      });

      export const { addItem, removeItem, clearCart, setLoggedIn, syncCart,setsidebarCart } = cartSlice.actions;

export default cartSlice.reducer;