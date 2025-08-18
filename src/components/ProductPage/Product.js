"use client"
import Image from "next/image";

import {   } from "@/MaterialTailwindNext";
import Customers from "./Customers";
import axios from 'axios';
import { useEffect, useState } from 'react';
import RelatedProducts from "../RelatedProducts";
import { useDispatch, useSelector } from "react-redux";
import { AddwishList, RemovewishList } from "@/lib/reducers/productbyIdReducer";
import { FaHeart, FaHeartCircleCheck, FaShare } from "react-icons/fa6";
import { RWebShare } from "react-web-share";
import toast from "react-hot-toast";
import { usePathname } from "next/navigation";
import { FaRegHeart } from "react-icons/fa";
import {
    Carousel,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,

  IconButton,
  Typography,
  Card,
} from "@/MaterialTailwindNext";
import { NavArrowLeft, NavArrowRight } from "iconoir-react";
import { addToCart } from "@/lib/reducers/cartReducer";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import ImageZoom from "react-image-zooom";
import Accordian, { AccordianItem } from "./Accordian";
import { formatPrice } from "@/utils/productDiscount";
import { Star } from "../HomePage/HotPicks";
import ProductDetailsLoader from "../Loaders/ProductDetailsLoader";
import { useMediaQuery } from "react-responsive";

const schema = yup.object().shape({
  pincode: yup
    .string()
    .matches(/^\d{6}$/, "Pincode must be exactly 6 digits with no spaces")
    ,
});
export default function Product({ product, relatedProducts, id }) {
  const isSmallScreen = useMediaQuery({ maxWidth: 768 });
    return (
        <div className="flex flex-col lg:flex-row gap-2 ">
           <div className="w-full md:w-[90%] lg:w-[40%] mx-auto">
            <div className="p-3 bg-[#F3F3F3] rounded-md md:mx-9  sticky top-24  ">
            <div className="flex flex-col item-center justify-center rounded-md p-2">

            <Carousel
            className="rounded-xl w-full  max-w-[500px] lg:max-w-none pb-16 mx-auto object-cover"
            prevArrow={({ handlePrev }) => (
              <IconButton
                size="lg"
                onClick={handlePrev}
                className="!absolute left-2 top-1/2 z-10 -translate-y-1/2 bg-white shadow-none border-2 border-primary-500 rounded-full hover:bg-primary-200"
              >
                <NavArrowLeft className="h-7 w-7 stroke-2 text-primary-500" />
              </IconButton>
            )}
            nextArrow={({ handleNext }) => (
              <IconButton
                size="lg"
                onClick={handleNext}
                className="!absolute right-2 top-1/2 z-10 -translate-y-1/2 bg-white shadow-none border-2 border-primary-500 rounded-full hover:bg-primary-200"
              >
                <NavArrowRight className="h-7 w-7 stroke-2 text-primary-500" />
              </IconButton>
            )}
            navigation={({ setActiveIndex, activeIndex }) => (
                <div  className="absolute bottom-0 left-[45%] z-50 flex -translate-x-2/4 gap-2">
                {product?.images?.map((img, i) => (
                    <Image
                    width={1000}
                    height={1000}
                    src={process.env.NEXT_PUBLIC_IMAGE_URL +img}
                    key={`productDetails ${i}`}
                    alt={`productDetails ${i}`}
                    className={`block my-auto cursor-pointer rounded-2xl transition-all content-[''] border-2 ${
                        activeIndex === i ? "w-16 h-16  bg-white border-primary-300" : "w-10 h-10 bg-white/50 border-blue-gray-100"
                    }`}
                    onClick={() => setActiveIndex(i)}
                    />
                ))}
                   {product?.video && <Image
                    width={1000}
                    height={1000}
                    src="/Video-icon.png"
                    key={`productDetails `}
                    alt={`productDetails vedio`}
                    className={`block my-auto cursor-pointer rounded-2xl transition-all content-[''] border-2  ${
                        activeIndex === product?.images?.length ? "w-16 h-16  bg-white border-primary-300" : "w-10 h-10 bg-white/50 border-blue-gray-100"
                    }`}
                    onClick={() => setActiveIndex(product?.images?.length)}
                    />}
                </div>
            )}
           >
                {product?.images?.map((img,ind)=>
            isSmallScreen ? <Image
             key={ind}
             src={process.env.NEXT_PUBLIC_IMAGE_URL +img}
             alt={`zm${ind}`} 
             fullWidth={true} 
           /> :<ImageZoom 
             key={ind}
             src={process.env.NEXT_PUBLIC_IMAGE_URL +img}
             alt={`zm${ind}`} 
             fullWidth={true} 
           /> 
           )}
               
              {  product?.video &&   <video
            controls
            src={process.env.NEXT_PUBLIC_IMAGE_URL+"video/upload/"+product?.video}
            style={{ maxWidth: '100%'}}
          />}
 
                </Carousel>
    
            </div>
      

        </div>
            </div>

            <div className="w-full lg:w-[60%] px-4 lg:px-0">
                <ProductInfo info={product} productId={id} />
                <RelatedProducts relatedProducts={relatedProducts} />
                <Customers productId={id} />
            </div>
        </div>
    );
}



function ProductInfo({info,productId}) {
    const pathname = usePathname();
    const dispatch = useDispatch();
    const {wishListByID,loadWishlist}= useSelector((state)=>state.wishlist);
    const {loadingProductId} = useSelector((state)=>state.cart)
    const [deliveryPincode, setDeliveryPincode] = useState("");
    const [serviceable, setServiceable] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    
    const {
      register,
      handleSubmit,
      formState: { errors },reset
    } = useForm({
      resolver: yupResolver(schema),
    });
    const currentUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${pathname}` 
    : '';
   const handleAddToCart = async (product) => {
       const data = { productId:product._id,name:product.name,quantity:1,img_src:product.images[0],price:product.price,discountedPrice:product.discountPrice,category:product.category.name,SKU:product.sku}
   
       dispatch(addToCart(data))
     };
     const {user} = useSelector((state)=>state.user);
  
    const onSubmit  = async (data) => {
      const code = data.pincode;
      try {
      setLoading(true)
      setError(null);
      const response = await fetch(
        `/api/products/${productId}/check-pincode?pickup_pincode=390007&delivery_pincode=${code}`
      );
      const data = await response.json();
      if (response.ok) {
        setServiceable(data.companyLength);
        setError(null);
      } else {
        setError(data.message);
        setServiceable(null);
      }
      setLoading(false)

    } catch (err) {
      setError("An error occurred while checking serviceability.");
      setServiceable(null);
      setLoading(false)
    }
    finally{
      setTimeout(()=>{
        setError(null);
        setServiceable(null);
      },5000)
    }
  };

   const handleBuyNow = async (product) => {
      const data = { productId: product._id, name: product.name, quantity: 1, img_src: product.images[0], price: product.price, discountedPrice: product.discountPrice, category: product.category.name, SKU: product.sku };
      dispatch(addToCart(data));
      router.push('/checkout');
    };

    return (
        <div className="py-4 pr-4 max-w-[800px]">
          <div class="mb-2 flex items-center  gap-4">
            <p class="text-2xl font-bold leading-tight text-primary-300 dark:text-white">{formatPrice(info?.discountPrice)}</p>
            <strike class="text-lg font-semibold leading-tight text-gray-500 dark:text-white">{formatPrice(info?.price)}</strike>
          </div>
            <h2 className="text-xl font-semibold">
                {info?.name}
            </h2>
            
            <div className="flex  items-center  py-2 gap-2">
                <p className="text-sm text-gray-600">Made with 925 Silver | </p>
                {user ? loadWishlist ===productId? <span className="h-5 w-5 border-t-transparent border-solid animate-spin rounded-full border-red-500 border-4  "></span>:wishListByID.some((item)=>item===productId) ?<button className="text-primary-500 text-sm  underline" onClick={()=>dispatch(RemovewishList(productId))}><FaHeart fontSize={20}/></button>
                :<button className=" text-sm  underline" onClick={()=>dispatch(AddwishList(productId))}><FaRegHeart  fontSize={20}/></button> : ""}
                
                <RWebShare
                data={{
                    text: info?.name,
                    url: currentUrl,
                    title: "Jenii - A JP Sterling Silver Brand | Premium Sterling Silver Jewellery",
                }}
            >
               <button className="text-primary-500 flex text-sm  underline py-1 px-3.5 border-[1px] rounded-full  border-primary-500 gap-2 "> <span> Share </span> <span> <FaShare fontSize={20}/></span></button>
            </RWebShare>
            </div>
            <div className="mt-2">
                

<div className="flex items-center">
    <Star rating={info?.averageRating.toFixed(1)} color="#f06292" />
    <p className="ms-2 text-sm font-bold text-gray-900 dark:text-white">{info?.averageRating.toFixed(1)}</p>
    <span className="w-1 h-1 mx-1.5 bg-gray-500 rounded-full dark:bg-gray-400"></span>
    <p className="text-sm font-medium text-gray-900  dark:text-white">{info?.numReviews} reviews</p>
</div>

            </div>

   <div className="overflow-x-auto mt-3">
  <table className="min-w-full border border-gray-200 text-sm text-left text-gray-700 dark:text-gray-200 dark:border-gray-700">
    <thead className="bg-gray-100 dark:bg-gray-800">
      <tr>
        <th className="w-1/3 px-4 py-2 border-b border-gray-300 dark:border-gray-600 font-semibold">
          Specification
        </th>
        <th className="px-4 py-2 border-b border-gray-300 dark:border-gray-600 font-semibold">
          Details
        </th>
      </tr>
    </thead>
    <tbody>
      {info?.specifications.map((spec, index) => (
        <tr key={index} className="even:bg-gray-50 dark:even:bg-gray-900">
          <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 font-medium">
            {spec.key}
          </td>
          <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            {spec.value}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

       
         

        <div className="text-sm ml-2 my-2">
          {info?.stock > 0 ? (
            <b className="rounded-sm bg-primary-500 px-1 py-0.5 text-xs font-medium text-white">
              In Stock
            </b>
            
          ) : (
            <b className="rounded-sm bg-red-600 px-1 py-0.5 text-xs font-medium text-white">
              ✗ Out of Stock
            </b>
            
          )}
        </div>
       
                { info?.stock > 0 ?  <form onSubmit={handleSubmit(onSubmit)} className="mt-3 ml-2">
      <p className="mb-2 text-xl font-semibold">Check our Pincode</p>
      <div className="relative flex h-10 w-full min-w-[200px] max-w-lg">
 <button type="submit"
    className="absolute bg-[#F8C0BF] right-0.5 h-[95%]  select-none rounded text-red-500 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase  shadow-md shadow-primary-500/20 transition-all hover:shadow-lg hover:shadow-primary-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none peer-placeholder-shown:pointer-events-none peer-placeholder-shown:bg-blue-gray-500 peer-placeholder-shown:opacity-50 peer-placeholder-shown:shadow-none"
    data-ripple-light="true"
    disabled={loading}
  >
    {loading ? (
          <div className="h-5 w-5  border-t-transparent border-solid animate-spin rounded-full border-white-500 border-4 mx-3"></div>
        ) : "Check"}
  </button>
  <input
    className={`peer h-full w-full rounded-[7px] border border-blue-gray-200 bg-transparent px-3 py-2.5 pr-20 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-primary-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 ${
      errors.pincode ? "border-red-500" : "border-gray-300"
    }`}
    type="text"
    maxLength={6}
    {...register("pincode")}
    placeholder=" "
    required
  />
  <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-primary-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-primary-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-primary-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
    Enter Pincode
  </label>
</div>
   
      </form>:""}

      {/* Error Message */}
      {errors.pincode ? (
        <p className="text-red-500 text-sm mt-1">{errors.pincode.message}</p>
      ):error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      {/* Display API response or errors */}
      {serviceable !== null && (
        <p className={`text-sm mt-2 ${serviceable ? "text-green-600" : "text-red-600"}`}>
          {serviceable
            ? "Serviceable for the given pincode."
            : "Not serviceable for the given pincode."}
        </p>
      )}
      <ProductFeatures />
      {info?.stock > 0 ?<div className="flex mt-4">
   <button className=" ml-3 border-[1px] border-[#f76664] hover:bg-[#f76664] text-black max-w-2xl  font-semibold p-2 rounded w-full my-2" onClick={()=>handleBuyNow(info)}>
                    Buy Now
                </button>
{loadingProductId === productId ?<button className="ml-3 border-[1px] max-w-2xl border-[#f76664] hover:bg-[#f76664] text-black font-semibold p-2 rounded w-full my-2" disabled>
                    Adding...
                </button>:
                <button className=" ml-3 border-[1px] bg-[#F8C0BF] hover:bg-[#f76664] text-black max-w-2xl  font-semibold p-2 rounded w-full my-2" onClick={()=>handleAddToCart(info)}>
                    Add To Cart
                </button>}
                </div>:""}
                
          
    <Details description={info?.description}/>
        </div>
    );
}

// const AccordionItem = ({ id, title, content }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <div
//       className={`accordion border border-solid border-gray-300 p-4 rounded-xl transition duration-500 ${
//         isOpen ? "bg-indigo-50 border-indigo-600" : ""
//       } `}
//       id={id}
//     >
//       <button
//         className={`accordion-toggle group inline-flex items-center justify-between text-left text-base leading-8 text-gray-900 w-full transition duration-500 hover:text-indigo-600 ${
//           isOpen ? "text-indigo-600" : ""
//         }`}
//         onClick={() => setIsOpen(!isOpen)}
//         aria-controls={`collapse-${id}`}
//         aria-expanded={isOpen}
//       >
//         <h5>{title}</h5>
//         <svg
//           className={`w-6 h-6 text-gray-900 transition duration-500 ${
//             isOpen ? "hidden" : "block"
//           } group-hover:text-indigo-600 origin-center`}
//           viewBox="0 0 24 24"
//           fill="none"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             d="M6 12H18M12 18V6"
//             stroke="currentColor"
//             strokeWidth="1.6"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//           ></path>
//         </svg>
//         <svg
//           className={`w-6 h-6 text-gray-900 transition duration-500 ${
//             isOpen ? "block" : "hidden"
//           } group-hover:text-indigo-600`}
//           viewBox="0 0 24 24"
//           fill="none"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             d="M6 12H18"
//             stroke="currentColor"
//             strokeWidth="1.6"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//           ></path>
//         </svg>
//       </button>
//       <div
//         id={`collapse-${id}`}
//         className={`accordion-content w-full overflow-hidden pr-4 transition-all ${
//           isOpen ? "max-h-screen" : "max-h-0"
//         }`}
//         aria-labelledby={id}
//       >
//         <p className="text-base text-gray-900 leading-6">{content}</p>
//       </div>
//     </div>
//   );
// };

const Details = ({description}) => {
  const items = [
    {
      id: "Product Details",
      title: "Description",
      content:<div className=" p-3 rounded-md" dangerouslySetInnerHTML={{__html:description}}>
      </div>,
    },
    {
      id: "basic-heading-two",
      title: "Shipping Details ",
      content:     <ul  className="space-y-4 text-gray-600">
      <li>
        <strong>Shipping Time:</strong> Orders are usually processed and shipped within 3-4 business days. Please note personalised items will take longer to process. If your order has both personalised and non-personalised items, the order will be split.
      </li>
      <li>
        <strong>Shipping Charges:</strong> We offer free shipping on all orders over Rs. 4999. Please note that we do not offer free shipping on international orders and returns.

      </li>
      <li>
        <strong>Tracking:</strong> You will receive tracking details over WhatsApp, email or SMS, once the order is shipped.
      </li>
      <li>In case you’re ordering other items along with personalised jewellery, your order might arrive in parts.</li>
    </ul>,
    },
   
  ];

  return (
    <div className="accordion-group mt-4" data-accordion="default-accordion">
      <Accordian className=" max-w-5xl">
      {items.map((item,i) => (
        <AccordianItem key={item.id} value={`${i}`} trigger={item.title}> {item.content}</AccordianItem>
      ))}
      </Accordian>
    </div>
  );
};





function ProductFeatures() {
    return (
        <>
        <div className="grid grid-cols-2 gap-4 mt-4 mx-2 text-sm">
            <FeatureItem label="Easy 15 Day Return" />
            <FeatureItem label="Lifetime Plating" />
            <FeatureItem label="925 Silver" />
            <FeatureItem label="6-Month Warranty" />
        </div>
        
        </>
    );
}

function FeatureItem({ label }) {
    return <div className="font-semibold">{label}</div>;
}
