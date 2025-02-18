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
import { useMediaQuery } from 'react-responsive';
import Zoomable from "react-instagram-zoom";
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
  const [loading, setloading] = useState(false);
const router = useRouter();
 
  const handleOpen = () => setOpen((cur) => !cur);
  const handleIsFavorite = () => setIsFavorite((cur) => !cur);

  const isSmallScreen = useMediaQuery({ maxWidth: 768 });

    useEffect(() => {
        if (id) {
            const fetchProduct = async () => {
                try {
                  setloading(true)
                    const response = await axios.get(`/api/products/${id}`);
                    setProduct(response.data.product);
                    console.log(response.data.product)
                    setRelatedProducts(response.data.relatedProducts);
                    setloading(false)
                } catch (error) {
                  setError("Error fetching product or related products");
                  console.error(error);
                  setloading(false)
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
            prevArrow={({ handlePrev }) => (
              <IconButton
                size="lg"
                onClick={handlePrev}
                className="!absolute left-2 top-1/2 z-10 -translate-y-1/2 bg-white shadow-none border-2 border-pink-500 rounded-full hover:bg-pink-200"
              >
                <NavArrowLeft className="h-7 w-7 stroke-2 text-pink-500" />
              </IconButton>
            )}
            nextArrow={({ handleNext }) => (
              <IconButton
                size="lg"
                onClick={handleNext}
                className="!absolute right-2 top-1/2 z-10 -translate-y-1/2 bg-white shadow-none border-2 border-pink-500 rounded-full hover:bg-pink-200"
              >
                <NavArrowRight className="h-7 w-7 stroke-2 text-pink-500" />
              </IconButton>
            )}
            navigation={({ setActiveIndex, activeIndex }) => (
                <div  className="absolute bottom-0 left-[45%] z-50 flex -translate-x-2/4 gap-2">
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
                   {product?.video && <Image
                    width={1000}
                    height={1000}
                    src="/Video-icon.png"
                    key={`productDetails `}
                    alt={`productDetails vedio`}
                    className={`block my-auto cursor-pointer rounded-2xl transition-all content-[''] border-2  ${
                        activeIndex === product?.images?.length ? "w-16 h-16  bg-white border-pink-300" : "w-10 h-10 bg-white/50 border-blue-gray-100"
                    }`}
                    onClick={() => setActiveIndex(product?.images?.length)}
                    />}
                </div>
            )}
           >
                {product?.images?.map((img,ind)=>
            isSmallScreen ? <Zoomable>
              <Image key={ind}
             src={img}
             alt={`zm${ind}`}      width={300}
             height={300}
             loading="lazy"/>
            </Zoomable> :<ImageZoom 
             key={ind}
             src={img}
             alt={`zm${ind}`} 
             fullWidth={true} 
           /> 
           )}
               
              {  product?.video &&   <video
            controls
            src={product?.video}
            style={{ maxWidth: '100%'}}
          />}
 
                </Carousel>
    
            </div>
                {/* <Button
            size="sm"
            variant="outlined"
            color="blue-gray"
            className="mr-5 flex items-center text-center hidden md:block"
            onClick={handleOpen}
          >
           Full View
          </Button> */}
            <>
     
     
     
       {/* <Dialog size="xl" open={open} handler={handleOpen}>
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
                {
                product?.images?.map((img, i) => (
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
                )
              )
              
                }
                <Image
                    width={1000}
                    height={1000}
                    src="Video-icon.png"
                    key={`productDetails `}
                    alt={`productDetails vedio`}
                    className={`block my-auto cursor-pointer rounded-2xl transition-all content-[''] border-2  ${
                        activeIndex === product?.images?.length-1 ? "w-16 h-16  bg-white border-pink-300" : "w-10 h-10 bg-white/50 border-blue-gray-100"
                    }`}
                    onClick={() => setActiveIndex(product?.images?.length-1)}
                    />
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
      </Dialog> */}
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

   const handleBuyNow = async (product) => {
      const data = { productId: product._id, name: product.name, quantity: 1, img_src: product.images[0], price: product.price, discountedPrice: product.discountPrice, category: product.category.name, SKU: product.sku };
      dispatch(addToCart(data));
      router.push('/checkout');
    };

    return (
        <div className="py-4 pr-4 max-w-[800px]">
          <div class="mb-2 flex items-center  gap-4">
            <p class="text-2xl font-bold leading-tight text-pink-300 dark:text-white">{formatPrice(info?.discountPrice)}</p>
            <strike class="text-lg font-semibold leading-tight text-gray-500 dark:text-white">{formatPrice(info?.price)}</strike>
          </div>
            <h2 className="text-xl font-semibold">
                {info?.name}
            </h2>
            <div className="flex py-2">
                <p className="text-sm text-gray-600">Made with 925 Silver |</p>
                {user ? loadWishlist ===productId? <span className="h-5 w-5 border-t-transparent border-solid animate-spin rounded-full border-red-500 border-4 mx-3 "></span>:wishListByID.some((item)=>item===productId) ?<button className="text-[#BC264B] text-sm mx-3 underline" onClick={()=>dispatch(RemovewishList(productId))}><FaHeartCircleCheck  fontSize={20}/></button>
                :<button className=" text-sm mx-3 underline" onClick={()=>dispatch(AddwishList(productId))}><FaRegHeart  fontSize={20}/></button> : ""}
                
                <RWebShare
                data={{
                    text: info?.name,
                    url: currentUrl,
                    title: "Jenii - A JP Sterling Silver Brand | Premium Sterling Silver Jewellery",
                }}
            >
               <button className="text-pink-300 text-sm  underline"><FaShare fontSize={20}/></button>
            </RWebShare>
            </div>
            <div className="mt-2">
                {/* <span className="p-2 bg-[#D9D9D9] rounded text-sm">★ {info?.averageRating.toFixed(1)}</span> */}
                

<div className="flex items-center">
    <Star rating={info?.averageRating.toFixed(1)} color="#f06292" />
    <p className="ms-2 text-sm font-bold text-gray-900 dark:text-white">{info?.averageRating.toFixed(1)}</p>
    <span className="w-1 h-1 mx-1.5 bg-gray-500 rounded-full dark:bg-gray-400"></span>
    <p className="text-sm font-medium text-gray-900  dark:text-white">{info?.numReviews} reviews</p>
</div>

            </div>
       
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 ml-2">
      <p className="mb-2 text-xl font-semibold">Check our Pincode</p>
      <div className="relative flex h-10 w-full min-w-[200px] max-w-lg">
 <button type="submit"
    className="absolute bg-[#F8C0BF] right-0.5 h-[95%]  select-none rounded text-red-500 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase  shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none peer-placeholder-shown:pointer-events-none peer-placeholder-shown:bg-blue-gray-500 peer-placeholder-shown:opacity-50 peer-placeholder-shown:shadow-none"
    data-ripple-light="true"
    disabled={loading}
  >
    {loading ? (
          <div className="h-5 w-5  border-t-transparent border-solid animate-spin rounded-full border-white-500 border-4 mx-3"></div>
        ) : "Check"}
  </button>
  <input
    className={`peer h-full w-full rounded-[7px] border border-blue-gray-200 bg-transparent px-3 py-2.5 pr-20 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-pink-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 ${
      errors.pincode ? "border-red-500" : "border-gray-300"
    }`}
    type="text"
    maxLength={6}
    {...register("pincode")}
    placeholder=" "
    required
  />
  <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-pink-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-pink-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-pink-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
    Enter Pincode
  </label>
</div>
   
      </form>

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
      <div className="flex mt-4">
   <button className=" ml-3 border-[1px] border-[#f76664] hover:bg-[#f76664] text-black max-w-2xl  font-semibold p-2 rounded w-full my-2" onClick={()=>handleBuyNow(info)}>
                    Buy Now
                </button>
{loadingProductId === productId ?<button className="ml-3 border-[1px] max-w-2xl border-[#f76664] hover:bg-[#f76664] text-black font-semibold p-2 rounded w-full my-2" disabled>
                    Adding...
                </button>:
                <button className=" ml-3 border-[1px] bg-[#F8C0BF] hover:bg-[#f76664] text-black max-w-2xl  font-semibold p-2 rounded w-full my-2" onClick={()=>handleAddToCart(info)}>
                    Add to Cart
                </button>}
                </div>
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
