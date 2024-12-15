'use client';
import { useEffect, useState } from "react";
import Image from "next/image";
import product from "../../assets/product.png";
import { getServerCookie } from "@/utils/serverCookie";
import axios from "axios";
import { useSelector } from "react-redux";

const formatPrice = (price) => {
  return price ? `Rs.${parseFloat(price).toFixed(2)}` : "N/A";
};
const OrderCart = () => {
  const {Items,totalDiscountedPrice, totalItem} = useSelector((state)=>state.cart);
  // Cart items state
  const [cartItems, setCartItems] = useState(null);
  const [totalPrice, setTotalPrice] = useState();


  const calculateTotal = (items) => {
    const total = items.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 1), 0);
    setTotalPrice(total);
  };
  useEffect(() => {
    const fetchCartData = async () => {
      const token = await getServerCookie("token");
      try {
        const itemsResponse = await axios.get("/api/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (itemsResponse.status === 200) {
          const items = itemsResponse.data.items || [];
          setCartItems(items);
          calculateTotal(items);
          console.log(items); 
        } else {
          setError("Failed to fetch cart items.");
        }
      } catch (err) {
        console.error(
          "Error fetching cart data",
          err.response ? err.response.data : err.message
        );
        setError("Server error while fetching cart data.");
      }
    };

    fetchCartData();
  }, []);

  // Selected items state (IDs of checked items)
  const [selectedItems, setSelectedItems] = useState([]);

  // Function to toggle item selection
  const toggleSelectItem = (id) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((itemId) => itemId !== id)
        : [...prevSelected, id]
    );
  };


  return (
    <div className="max-w-lg mx-auto p-4 bg-[#EFEFEF] rounded-lg shadow-lg mt-5">
      {/* Cart Title */}
      <h2 className="text-xl font-semibold mb-4">Cart</h2>

      {/* Scrollable Items */}
      <div className=" min-h-0  lg:min-h-[300px] overflow-y-auto mb-4 bg-[#FBFBFB] ">
        {Items?.map((item) => (
           <div className="flex items-start p-2 my-2 mb-2">
           <div>
             <Image
               src={item.img_src}
               width={78}
               height={78}
               className="rounded-lg mr-2"
               alt="Product Image"
             />
                 </div>
           <div className="ml-4">
             <h3 className="text-sm font-semibold">{item.name}</h3>
             <p className="text-sm">Qty: {item.quantity}</p>
                     <p className="text-sm font-semibold text-pink-600">{formatPrice(item.discountedPrice)}</p>
                   </div>
         </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between font-semibold">   
          <span className="text-sm">{totalItem} Items</span>
        <div >
        <span className="text-sm">Total Cost : </span><span className="text-pink-700 cursor-pointer">{formatPrice(totalDiscountedPrice)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderCart;
