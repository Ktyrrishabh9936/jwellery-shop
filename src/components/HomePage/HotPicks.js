import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Navigation } from "swiper/modules";
import "swiper/css/navigation";
import Link from "next/link";
import Image from "next/image";
import { fetchmoretopcollectionProducts, fetchtopcollectionProducts } from "@/lib/reducers/collectionReducer";
import { formatPrice } from "@/utils/productDiscount";
import { addToCart } from "@/lib/reducers/cartReducer";
import { Button, IconButton } from "@/MaterialTailwindNext";
import Skel from "@skel-ui/react";
import toast from "react-hot-toast";
import { NavArrowLeft } from "iconoir-react";
const HotPicks = () => {
   const {user} = useSelector((store)=>store.user);
  
  const dispatch = useDispatch();
  const {  topPicks, topPicksCurrentPage, topPicksTotalPages,topPicksLoading,topPicksNextload} = useSelector((state) => state.collection);

  useEffect(() => {
    if(topPicksCurrentPage <= 1){
    dispatch(fetchtopcollectionProducts({page: 1, limit: 10 }));
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
    0: { slidesPerView: 2, spaceBetween: 5 },
    540: { slidesPerView: 3, spaceBetween: 7 },
    768: { slidesPerView: 4, spaceBetween: 10 },
    960: { slidesPerView: 4, spaceBetween: 15 },
  };

  return (
    <section className="max-w-7xl mx-auto p-2 sm:p-4 mb-8 pb-4">
    {topPicks.length ? <>  <h2 className="text-2xl font-bold mt-6 ml-3">Top Products</h2>
    <div className="relative">
    <div className="absolute top-0 right-0 flex items-center gap-2 z-10">
        <IconButton
          className="swiper-button-prev absolute -top-3 right-10 bg-gray-200 hover:bg-gray-300 p-2 rounded-full"
          aria-label="Previous Slide"
        >
          <NavArrowLeft/>
        </IconButton>
        <button
          className="swiper-button-next absolute -top-3 right-2 bg-gray-200 hover:bg-gray-300 p-2 rounded-full"
          aria-label="Next Slide"
        >
          Next
        </button>
      </div>
      <Swiper
        spaceBetween={10}
        slidesPerView="auto"
        slidesPerColumn={2} // Two rows
        modules={[Navigation]}
        navigation={{
          prevEl: ".swiper-button-prev",
          nextEl: ".swiper-button-next",
        }}
        slidesPerColumnFill="row"
        onReachEnd={handleFetchMore} // Fetch more products on reaching end
        breakpoints={breakpoints}
      >
        {topPicks.map((product) => (
          <SwiperSlide key={product._id} className="carousel-slide">
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
      </Swiper></div></> :<div>
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
