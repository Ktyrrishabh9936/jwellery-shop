'use client';
import Image from "next/image";

import { useSelector } from "react-redux";

const formatPrice = (price) => {
  return price ? `Rs.${parseFloat(price).toFixed(2)}` : "N/A";
};
const OrderCart = () => {
  const {Items,totalDiscountedPrice, totalItem} = useSelector((state)=>state.cart);
 
  return (
    <div className="max-w-lg mx-auto p-4 bg-[#EFEFEF] rounded-lg shadow-lg mt-5">
      {/* Cart Title */}
      <h2 className="text-xl font-semibold mb-4">Cart</h2>

      {/* Scrollable Items */}
      <div className=" min-h-0  lg:min-h-[300px] overflow-y-auto mb-4 bg-[#FBFBFB] ">
        {Items?.map((item,ind) => (
           <div className="flex items-start p-2 my-2 mb-2" key={ind}>
           <div>
             <Image
              src={process.env.NEXT_PUBLIC_IMAGE_URL +item.img_src}
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
