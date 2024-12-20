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
import { addToCart } from "@/lib/reducers/cartReducer";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object().shape({
  pincode: yup
    .string()
    .matches(/^\d{6}$/, "Pincode must be exactly 6 digits with no spaces")
    ,
});
export default function Product({ id }) {
 
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [error, setError] = useState(null);
    const [open, setOpen] =useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
 
  const handleOpen = () => setOpen((cur) => !cur);
  const handleIsFavorite = () => setIsFavorite((cur) => !cur);

    useEffect(() => {
        if (id) {
            const fetchProduct = async () => {
                try {
                    const response = await axios.get(`/api/products/${id}`);
                    setProduct(response.data.product);
                    setRelatedProducts(response.data.relatedProducts);
                } catch (error) {
                    setError("Error fetching product or related products");
                    console.error(error);
                }
            };

            fetchProduct();
        }
    }, [id]);


    return (
        <div className="flex flex-col lg:flex-row gap-2 ">
           <div className="w-full md:w-[90%] lg:w-[40%] mx-auto">
            <div className="p-3 bg-[#F3F3F3] rounded-md md:mx-9  sticky top-24  ">
            <div className="flex flex-col item-center justify-center rounded-md p-2">

            <Carousel
            className="rounded-xl w-full  max-w-[500px] lg:max-w-none pb-16 mx-auto object-cover"

            navigation={({ setActiveIndex, activeIndex }) => (
                <div  className="absolute bottom-0 left-2/4 z-50 flex -translate-x-2/4 gap-2">
                {product?.images?.map((img, i) => (
                    <Image
                    width={1000}
                    height={1000}
                    src={img}
                    key={`productDetails ${i}`}
                    alt={`productDetails ${i}`}
                    className={`block my-auto cursor-pointer rounded-2xl transition-all content-[''] border-2 ${
                        activeIndex === i ? "w-16 h-16  bg-white border-pink-300" : "w-10 h-10 bg-white/50 border-blue-gray-100"
                    }`}
                    onClick={() => setActiveIndex(i)}
                    />
                ))}
                </div>
            )}
           >
                {product?.images?.map((img,ind)=><Image
                width={400}
                height={400}
                    src={img}
                    alt={`Product${ind}`}
                    key={`Product${ind}`}
                    className="object-contain w-full h-auto  "
                />)}
                </Carousel>
    
            </div>
                <Button
            size="sm"
            variant="outlined"
            color="blue-gray"
            className="mr-5 flex items-center text-center hidden md:block"
            onClick={handleOpen}
          >
           Full View
          </Button>
            <>
     
     
     
       <Dialog size="xl" open={open} handler={handleOpen}>
        <DialogHeader className="justify-between">
          <div className="flex items-center gap-3">
          
            <div className="-mt-px flex flex-col">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-medium"
              >
               {product?.name}
              </Typography>
       
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <IconButton
              variant="text"
              size="sm"
              color={isFavorite ? "red" : "blue-gray"}
              onClick={handleIsFavorite}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
            </IconButton>
            <Button
            size="sm"
            variant="outlined"
            color="blue-gray"
            className="mr-5 flex items-center"
          >
            Share
          </Button>
          </div>
        </DialogHeader>
        <DialogBody>
        <Carousel
            className="h-[70vh] rounded-xl w-[500px]  md:w-full  max-w-[500px] md:max-w-none pb-16"
            navigation={({ setActiveIndex, activeIndex }) => (
                <div className="">
                {product?.images?.map((img, i) => (
                    <Image
                    width={1000}
                    height={1000}
                    src={img}
                    key={`productDetails ${i}`}
                    alt={`product))Details ${i}`}
                    className={`block my-auto cursor-pointer rounded-2xl transition-all content-[''] border-2  ${
                        activeIndex === i ? "w-16 h-16  bg-white border-pink-300" : "w-10 h-10 bg-white/50 border-blue-gray-100"
                    }`}
                    onClick={() => setActiveIndex(i)}
                    />
                ))}
                </div>
            )}
            >
                {product?.images?.map((img,ind)=><Image
                width={400}
                height={400}
                    src={img}
                    alt={`Product${ind}`}
                    key={`Product${ind}`}
                    className="object-contain w-full h-full "
                />)}
                </Carousel>
        </DialogBody>
        <DialogFooter className="justify-between">
       
          
        </DialogFooter>
      </Dialog>
    </>

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

// function ProductImageSection({product}) {
//     return (
//         <div className="p-3 bg-[#F3F3F3] rounded-md md:mx-9  sticky top-24">
//             <div className="flex item-center justify-center rounded-md p-2">
//             <Carousel
//             className="rounded-xl w-[500px]  md:w-[449px] md:h-[528px] max-w-[500px] md:max-w-none"
//             navigation={({ setActiveIndex, activeIndex }) => (
//                 <div className="absolute bottom-0 left-2/4 z-50 flex -translate-x-2/4 gap-2">
//                 {product?.images?.map((img, i) => (
//                     <Image
//                     width={500}
//                     height={500}
//                     src={img}
//                     key={`productDetails ${i}`}
//                     alt={`productDetails ${i}`}
//                     className={`block my-auto cursor-pointer rounded-2xl transition-all content-[''] border-2 ${
//                         activeIndex === i ? "w-16 h-16  bg-white border-pink-300" : "w-10 h-10 bg-white/50 border-blue-gray-100"
//                     }`}
//                     onClick={() => setActiveIndex(i)}
//                     />
//                 ))}
//                 </div>
//             )}
//             >
//                 {product?.images?.map((img,ind)=><Image
//                 width={400}
//                 height={400}
//                     src={img}
//                     alt={`Product${ind}`}
//                     key={`Product${ind}`}
//                     className="object-contain w-full h-auto"
//                 />)}
//                 </Carousel>
//             </div>
//             {/* <div className="flex justify-center mt-4 gap-2">
//             {Array(4)
//                 .fill("")
//                 .map((_, index) => (
//                     <div
//                         key={index}
//                         className="w-16 h-16 bg-gray-300 border border-gray-300"
//                     ></div>
//                 ))}
//         </div> */}
//         </div>
//     );
// }


function ProductInfo({info,productId}) {
    const pathname = usePathname();
    const dispatch = useDispatch();
    const {wishListByID,loadWishlist}= useSelector((state)=>state.wishlist);
    const {loadingProductId} = useSelector((state)=>state.cart)
    const [deliveryPincode, setDeliveryPincode] = useState("");
    const [serviceable, setServiceable] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
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


    const onSubmit  = async (data) => {
      const code = data.pincode;
      try {
      setLoading(true)
      setError(null);
      const response = await fetch(
        `/api/products/${productId}/check-pincode?pickup_pincode=390020&delivery_pincode=${code}`
      );
      const data = await response.json();
      console.log(data)
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

    return (
        <div className="py-4 pr-4 max-w-[800px]">
            <h2 className="text-xl font-semibold">
                {info?.name}
            </h2>
            <div className="flex py-2">
                <p className="text-sm text-gray-600">Made with 925 Silver |</p>
                {loadWishlist ===productId? <span className="h-5 w-5 border-t-transparent border-solid animate-spin rounded-full border-red-500 border-4 mx-3 "></span>:wishListByID.some((item)=>item===productId) ?<button className="text-[#BC264B] text-sm mx-3 underline" onClick={()=>dispatch(RemovewishList(productId))}><FaHeartCircleCheck  fontSize={20}/></button>
                :<button className=" text-sm mx-3 underline" onClick={()=>dispatch(AddwishList(productId))}><FaRegHeart  fontSize={20}/></button>}
                
                <RWebShare
                data={{
                    text: info?.name,
                    url: currentUrl,
                    title: "Jenii - A JP Sterling Silver Brand | Premium Sterling Silver Jewellery",
                }}
                onClick={() => toast.success("shared successfully!")}
            >
               <button className="text-pink-300 text-sm  underline"><FaShare fontSize={20}/></button>
            </RWebShare>
            </div>
            <div className="mt-2">
                {/* <span className="p-2 bg-[#D9D9D9] rounded text-sm">★ {info?.averageRating.toFixed(1)}</span> */}
                

<div className="flex items-center">
    <svg className="w-4 h-4 text-pink-300 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
    </svg>
    <p className="ms-2 text-sm font-bold text-gray-900 dark:text-white">{info?.averageRating.toFixed(1)}</p>
    <span className="w-1 h-1 mx-1.5 bg-gray-500 rounded-full dark:bg-gray-400"></span>
    <a href="#" className="text-sm font-medium text-gray-900 underline hover:no-underline dark:text-white">{info?.numReviews} reviews</a>
</div>

            </div>
            <div className="mt-4">
            <h3 className="text-md font-semibold ">Description</h3>
            <div className="bg-[#F6F6F6] p-3 rounded-md" dangerouslySetInnerHTML={{__html:info?.description}}>
               
            </div>
            <div className="mt-4">
                <button className="text-[#BC264B] text-sm mx-3 underline">See the Offers</button>
            </div>
        </div>
            <ProductFeatures />
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
      <p className="mb-2 text-xl font-semibold">Check our Pincode</p>
      <input
        type="text"
        maxLength={6}
        {...register("pincode")}
        placeholder="Enter 6 Digit Pincode"
        className={`border text-black bg-[#EAEAEA] p-2 rounded w-1/2 ${
          errors.pincode ? "border-red-500" : "border-gray-300"
        }`}
      />
      <div className="mt-3">
        {loading ? (
          <div className="h-5 w-5  border-t-transparent border-solid animate-spin rounded-full border-red-500 border-4 mx-3"></div>
        ) : (
          <button
            className="text-[#BC264B] text-sm underline"
            type="submit"
          >
            Check
          </button>
        )}
      </div>

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

{loadingProductId === productId ?<button className=" border-[1px] border-[#f76664] hover:bg-[#f76664] text-black font-semibold p-2 rounded w-full m-2" disabled>
                    Adding...
                </button>:
                <button className=" border-[1px] bg-[#F8C0BF] hover:bg-[#f76664] text-black font-semibold p-2 rounded w-full m-2" onClick={()=>dispatch(addToCart({productId:productId,quantity:1}))}>
                    Add to Cart
                </button>}
    </form>
        </div>
    );
}

const AccordionItem = ({ id, title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`accordion border border-solid border-gray-300 p-4 rounded-xl transition duration-500 ${
        isOpen ? "bg-indigo-50 border-indigo-600" : ""
      } `}
      id={id}
    >
      <button
        className={`accordion-toggle group inline-flex items-center justify-between text-left text-base leading-8 text-gray-900 w-full transition duration-500 hover:text-indigo-600 ${
          isOpen ? "text-indigo-600" : ""
        }`}
        onClick={() => setIsOpen(!isOpen)}
        aria-controls={`collapse-${id}`}
        aria-expanded={isOpen}
      >
        <h5>{title}</h5>
        <svg
          className={`w-6 h-6 text-gray-900 transition duration-500 ${
            isOpen ? "hidden" : "block"
          } group-hover:text-indigo-600 origin-center`}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 12H18M12 18V6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
        <svg
          className={`w-6 h-6 text-gray-900 transition duration-500 ${
            isOpen ? "block" : "hidden"
          } group-hover:text-indigo-600`}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 12H18"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
      </button>
      <div
        id={`collapse-${id}`}
        className={`accordion-content w-full overflow-hidden pr-4 transition-all ${
          isOpen ? "max-h-screen" : "max-h-0"
        }`}
        aria-labelledby={id}
      >
        <p className="text-base text-gray-900 leading-6">{content}</p>
      </div>
    </div>
  );
};

const Accordion = () => {
  const items = [
    {
      id: "Description",
      title: "Description",
      content:
        "To create an account, find the 'Sign up' or 'Create account' button, fill out the registration form with your personal information, and click 'Create account' or 'Sign up.' Verify your email address if needed, and then log in to start using the platform.",
    },
    {
      id: "basic-heading-two",
      title: "shipping",
      content:
        "Free express shipping 6 month warranty Shipping internationally to 20+ countriesBrand owned and marketed by: Indiejewel Fashions Private Limited No questions asked 30 days return policy 3rd floor, Magnum Vista, Raghuvanahalli, Bangalore, Karnataka - 560062",
    },
   
  ];

  return (
    <div className="accordion-group mt-4" data-accordion="default-accordion">
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          id={item.id}
          title={item.title}
          content={item.content}
        />
      ))}
    </div>
  );
};



function ProductFeatures() {
    return (
        <>
        <div className="grid grid-cols-2 gap-4 mt-4 mx-2 text-sm">
            <FeatureItem label="Easy 30 Day Return" />
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
