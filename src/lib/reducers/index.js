import { combineReducers } from "@reduxjs/toolkit"
import categoryReducer from "./categoryReducer"
import slidesReducer from "./slidesReducer"
import userReducer from "./userReducer"
import productbyIdReducer from "./productbyIdReducer"
import productReducer from "./productReducer"
import wishListReducer from "./wishlistReducer"
import cartReducer from "./cartReducer"
import addressReducer from "./addressReducer"
import collectionReducer from "./collectionReducer"

const rootReducer = combineReducers({
        categories:categoryReducer,
        slides:slidesReducer,
        user:userReducer,
        wishlist:wishListReducer,
        product:productbyIdReducer,
        filteredProducts:productReducer,
        collection:collectionReducer,
        cart:cartReducer,
        address:addressReducer,
  })
  export default rootReducer;