import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import "swiper/css";
import "swiper/css/scrollbar";
import "swiper/css/grid";
import Link from "next/link";
import Image from "next/image";
import { Navigation,Scrollbar,Grid } from "swiper/modules";
import "swiper/css/navigation";
import { fetchmoretopcollectionProducts, fetchtopcollectionProducts } from "@/lib/reducers/collectionReducer";
import { formatPrice } from "@/utils/productDiscount";
import { addToCart } from "@/lib/reducers/cartReducer";
import { Button, IconButton } from "@/MaterialTailwindNext";
import Skel from "@skel-ui/react";
import toast from "react-hot-toast";
import { NavArrowLeft, NavArrowRight } from "iconoir-react";

export function CustomNavigation() {
  const swiper = useSwiper();
  const {topPicksNextload} = useSelector((state) => state.collection);
  return (
    <div className=" hidden md:block">
      <IconButton
        size="lg"
        onClick={() => swiper.slidePrev()}
        className=" !absolute right-16 top-7 border-2 border-pink-500 z-10 -translate-y-1/2 bg-transparent shadow-none rounded-full bg-white"
      >
        <NavArrowLeft className="h-7 w-7 -translate-x-0.5 stroke-2 text-pink-500" />
      </IconButton>

      {
        topPicksNextload?<IconButton
        size="lg"
        className=" !absolute right-2 top-7 z-10 border-2 border-pink-500  -translate-y-1/2 bg-transparent shadow-none rounded-full bg-white"
      >
        <div className="h-5 w-5 border-t-transparent border-solid animate-spin rounded-full border-pink-700 border-4"></div>
      </IconButton>
        :<IconButton
        size="lg"
        onClick={() => swiper.slideNext()}
        className=" !absolute right-2 top-7 z-10 border-2 border-pink-500  -translate-y-1/2 bg-transparent shadow-none rounded-full bg-white"
      >
        <NavArrowRight className="h-7 w-7 translate-x-px stroke-2 text-pink-500  " />
      </IconButton>}
    </div>
  );
}
const TopProductCarousel = () => {
   const {user} = useSelector((store)=>store.user);
  
  const dispatch = useDispatch();
  const {  topPicks, topPicksCurrentPage, topPicksTotalPages,topPicksLoading} = useSelector((state) => state.collection);

  useEffect(() => {
    if(topPicksCurrentPage <= 1){
    dispatch(fetchtopcollectionProducts({page: 1, limit: 8 }));
    }
  }, []);

  const handleFetchMore = () => {
    if (topPicksCurrentPage < topPicksTotalPages && !topPicksLoading) {
      dispatch(fetchmoretopcollectionProducts({ page: topPicksCurrentPage + 1, limit: 8 }));
    }
  };
  const handleAddToCart = async (product) => {

    // Check if the user is logged in
    if (!user) {
      toast.error("Please log in to add products to your cart!");
      return;
    }

    dispatch(addToCart({productId:product._id,quantity:1}))
  };
  const {loadingProductId} = useSelector((state)=>state.cart)
  const breakpoints = {
    0: { slidesPerView: "auto" , slidesPerGroup:2},
    540: { slidesPerView: 3, slidesPerGroup: 2},
    768: { slidesPerView: 4 , slidesPerGroup:4},
    960: { slidesPerView: 4  , slidesPerGroup:4},
  };

  return (
    <section className=" relative max-w-7xl mx-auto p-2 sm:p-4 mb-8 pb-4">
    {topPicks.length ? <>  
    <div className=" ">
      <div>
    <h2 className="text-2xl font-bold  ml-3">Top Products</h2>
    </div>
    {/* <div className=" flex justify-end items-center gap-4 w-full">
    <button
          className=" hidden md:block swiper-button-prev absolute top-[40%] left-3 bg-white rounded-full p-2 shadow-md -ml-4 hover:bg-gray-100"
          aria-label="Previous"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
        </button>
        <button
          className="hidden md:block swiper-button-next absolute top-[40%] right-3 bg-white rounded-full p-2 shadow-md -mr-4 hover:bg-gray-100"
          aria-label="Next"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
            />
          </svg>
        </button>
</div> */}

    </div>
      

      <Swiper
        // spaceBetween={10}
        modules={[Navigation,Scrollbar,Grid]}
         className=" rounded-lg [&_div.swiper-button-next]:text-background [&_div.swiper-button-prev]:text-background cursor-pointer pb-6 no-scrollbar"
         direction="horizontal"
         scrollbar={{ draggable: true }} 
         spaceBetween={0}
         grid={{rows: 2, fill: 'row'}}
        onReachEnd={handleFetchMore} // Fetch more products on reaching end
        breakpoints={breakpoints}
        slidesPerView="auto"   // Automatically adjusts slides per view
        slidesPerGroupAuto={true} // Automatically adjusts slides per group
        freeMode={true}        // Allows smooth free scrolling
        grabCursor={true}      
      >
        {topPicks.map((product) => (
          <SwiperSlide key={product._id} className="carousel-slide mt-0 md:mt-14 max-w-[200px] md:max-w-none"  >
              <div 
              key={product._id}
              className="bg-white rounded-lg p-2 md:p-4 shadow-none md:hover:shadow-xl hover:bg-gray-100 transition-[--tw-shadow] "
            >
              <Link href={`/product/${product._id}`} >
              <Image
                width={300}
                height={300}
                loading="lazy"
                src={product.images[0]}
                alt={product.name}
                className="w-full h-[clamp(11rem,18vw,20rem)] object-cover rounded-lg "
              />
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
          </SwiperSlide>
        ))}
        <CustomNavigation />
      </Swiper></> :<div>
        <Skel.Item className="h-8 w-32 bg-gray-200 shimmer mb-4" /> 

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array(8).fill(0).map((_, index) => (
            <div key={index} className="space-y-4">
              <Skel.Item className="w-full h-56 bg-gray-200 shimmer rounded-lg" /> 
              <div className="flex justify-between" >
              <Skel.Item className="h-3 w-24 bg-gray-200 shimmer" /> 
              <Skel.Item className="h-3 w-10 bg-gray-200 shimmer" /> 
              </div>
              <Skel.Item className="h-4 w-32 bg-gray-200 shimmer" />
              <Skel.Item className="h-8 w-full rounded-md bg-gray-200 shimmer" />
            </div>
          ))}
        </div>
      </div>}
    </section>
  );
};

export default TopProductCarousel;
