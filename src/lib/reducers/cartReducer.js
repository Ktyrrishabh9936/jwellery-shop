import {createAsyncThunk,createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
// import { getSession } from "next-auth/react";

const loadCartFromLocalStorage = () => {
  if (typeof window !== 'undefined') {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  }
  return [];
};

const saveCartToLocalStorage = (cart) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
};

export const fetchCart = createAsyncThunk('cart/fetch',
        async(_,{rejectedWithValue})=>{
          // const session = await getSession();
  if (false) {
                try {
                        const response = await axios.get('/api/cart')
                        if(response.data.successType == "EMPTY"){
                                return {totalItem:0}
                        }else{
                        return response.data.cart;
                }
                } catch (error) {
                       
                        return rejectedWithValue(error.message)
                }}
                else {
                  const cart = loadCartFromLocalStorage();
                  return {localCart:true,cart};
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
        async(item,{rejectedWithValue})=>{
          // const session = await getSession();
  if (false) {
                try {
                        const response = await axios.post('/api/cart/add',{productId:item.productId,quantity:item.quantity});
                        console.log(response.data)
                        toast.success("Product added to cart!");

                        return response.data;
                } catch (error) {
                        return rejectedWithValue(error.message)
                }
        }else {
          const cart = loadCartFromLocalStorage();
          const existingItem = cart.find((i) => i.productId === item.productId);
          if (existingItem) {
            existingItem.quantity += item.quantity;
          } else {
            cart.push(item);
          }
          saveCartToLocalStorage(cart);
          toast.success("Product added to cart!");
          return {localCart:true,cart};
        }
})
export const removefromCart = createAsyncThunk('cart/remove',
        async(productId,{rejectedWithValue})=>{
          // const session = await getSession();
  if (false) {
                try {
                        const response = await axios.post('/api/cart/remove',{productId})
                        console.log(response.data)
                        return response.data;
                } catch (error) {
                        return rejectedWithValue(error.message)
                }
              } else {
                const cart = loadCartFromLocalStorage();
                const updatedCart = cart.filter((item) => item.productId !== productId);
                saveCartToLocalStorage(updatedCart);
                return {localCart:true,cart:updatedCart};
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
    discounte = totalPrice - totalDiscountedPrice;
  });   
 
  return { discounte,totalPrice, totalDiscountedPrice, totalItem };
};
const initialState = {
        openSideCart:false,
        loadingProductId:null,
        loadingRemoveProduct:null,
        totalItem:0,
        Items: loadCartFromLocalStorage(),
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
            const existingItem = state.Items.find((item) => item.id === action.payload.id);
            if (existingItem) {
              existingItem.quantity += action.payload.quantity;
            } else {
              state.Items.push(action.payload);
            }
            localStorage.setItem("cart", JSON.stringify(state.Items));
          },
          removeItem: (state, action) => {
            state.Items = state.Items.filter((item) => item.id !== action.payload);
            localStorage.setItem("cart", JSON.stringify(state.Items));
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
            state.Items = action.payload;
            localStorage.setItem("cart", JSON.stringify(state.Items));
          },
        },
        extraReducers: (builder) => {
          builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;

      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        let data ;
        if(action.payload.localCart){
         data = action.payload.cart;

        }else{
        data = action.payload.items;
        state.isFetched = true;
        }
        state.Items = data;
        console.log(data)
        const { discounte,totalPrice, totalDiscountedPrice, totalItem } = calculateTotals(data);
        state.totalItem = totalItem;
        state.totalPrice = totalPrice;
        state.discounte = discounte;
        state.totalDiscountedPrice = totalDiscountedPrice;
        
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
       if(action.payload.localCart){
        data = action.payload.cart;
       }else{
        if(action.payload.isExist){
          const idx = state.Items.findIndex((val)=>val.productId === action.meta.arg.productId);
            console.log(idx)
          state.Items[idx] = action.payload.item;
          data=state.Items;
        }
        else{
          data = state.Items? [...state.Items,action.payload.item] : [action.payload.item]
        }
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
        let data ;
        if(action.payload.localCart){
         data = action.payload.cart;
        }else{
        data = state.Items.filter((val)=>val.productId !== action.meta.arg);
        }
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