import { combineReducers } from "@reduxjs/toolkit"
import categoryReducer from "./categoryReducer"
import slidesReducer from "./slidesReducer"
import userReducer from "./userReducer"
import productbyIdReducer from "./productbyIdReducer"
import productReducer from "./productReducer"
import wishListReducer from "./wishlistReducer"
import cartReducer from "./cartReducer"
import addressReducer from "./addressReducer"

const rootReducer = combineReducers({
        categories:categoryReducer,
        slides:slidesReducer,
        user:userReducer,
        wishlist:wishListReducer,
        product:productbyIdReducer,
        filteredProducts:productReducer,
        cart:cartReducer,
        address:addressReducer,
  })
  export default rootReducer;