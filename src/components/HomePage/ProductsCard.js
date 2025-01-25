import React, { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from "@/utils/productDiscount";
import { addToCart } from "@/lib/reducers/cartReducer";
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/MaterialTailwindNext';

export default function ProductCard({product}) {
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useDispatch();
  const handleAddToCart = async (product) => {
    const data = { productId:product._id,name:product.name,quantity:1,img_src:product.images[0],price:product.price,discountedPrice:product.discountPrice,category:product.category.name,SKU:product.sku}

    dispatch(addToCart(data))
  };
  const {loadingProductId} = useSelector((state)=>state.cart)
  
  return (
    <div 
    key={product._id}
    className="bg-white rounded-lg p-2 md:p-4 shadow-none md:hover:shadow-xl hover:bg-gray-100 transition-[--tw-shadow] " onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
  >
    <Link href={`/product/${product._id}`} >
    <div className="relative">
{ !isHovered      ?
<Image
width={300}
height={300}
loading="lazy"
src={product.images[0]}
alt={product.name}
className="w-full h-[clamp(11rem,18vw,20rem)] object-cover rounded-lg "
/>
:<Swiper
  modules={[Autoplay]}
  autoplay={{
    delay: 2000,
    disableOnInteraction: false,
  }}
  loop={true}
  slidesPerView={1}
  className="w-full h-[clamp(11rem,18vw,20rem)] rounded-lg overflow-hidden"

>
  {product.images.map((image, index) => (
   index && <SwiperSlide key={index}>
      <Image
        src={image}
        alt={`Image ${index + 1}`}
        width={300}
        height={300}
        className="object-cover w-full h-full"
        loading="lazy"
      />
    </SwiperSlide>
  ))}
</Swiper>}
</div>
      <div className="flex justify-between items-center gap-2 mt-2">
        <div className="flex  items-center gap-x-2  line-clamp-1 w-[90%]">
          <span className="text-[#1E1E1E] font-semibold text-sm md:text-base ">
            {formatPrice(product.discountPrice)}
          </span>
          <strike className=" text-[#F42222] text-xs  line-clamp-1">
            {formatPrice(product.price)}
          </strike>
        </div>
        <div className="text-sm text-gray-500  flex justify-center items-center gap-2 w-[40px]">
          <span className="text-[#F42222]">★</span>
          <span>{product.averageRating.toFixed(1)}</span>
        </div>
      </div>
      <div className="text-gray-600 line-clamp-1">{product.name}</div>
    </Link>
    <Button
      className="mt-4 bg-[#F8C0BF] hover:bg-[#fe6161] transition-colors py-2 duration-300 px-4 rounded-md w-full capitalize text-sm"
      onClick={() => handleAddToCart(product)}
      disabled={loadingProductId === product._id}
    >
      {loadingProductId === product._id ? "Adding..." : "Add to Cart"}
    </Button>
  </div>
  )
}
