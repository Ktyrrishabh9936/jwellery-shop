import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { fetchHotPicks, fetchMoreHotPicks } from "@/lib/reducers/collectionReducer";
import { formatPrice } from "@/utils/productDiscount";
import { addToCart } from "@/lib/reducers/cartReducer";
import { Button } from "@/MaterialTailwindNext";
import Skel from "@skel-ui/react";
import toast from "react-hot-toast";
import InfiniteScroll from "react-infinite-scroll-component";
import { TiStarFullOutline,TiStarHalfOutline,TiStarOutline } from "react-icons/ti";
import ProductGridLoader from "../Loaders/ProductGridLoader";
 function Star({rating,size='clamp(1rem,1.3vw,3rem)' ,color='#fe6161'}) {
  const ratingfunc = Array.from({length:5},(elem,index)=>{
          const number = rating+0.5;
           return(rating >= index+1 ? <TiStarFullOutline   style={{fontSize:size,color}} key={index}/> : number >= index+1 ? <TiStarHalfOutline style={{fontSize:size,color}} key={index}/> : <TiStarOutline   style={{fontSize:size,color}} key={index}/>)
})
return (
<div className="flex flex-row ">
  {ratingfunc}
</div>
)
}
const HotPicks = () => {
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const {
    hotPicks,
    hotPicksCurrentPage,
    hotPicksTotalPages,
    hotPicksLoading,
  } = useSelector((state) => state.collection);

  useEffect(() => {
    if (hotPicksCurrentPage <= 1) {
      dispatch(fetchHotPicks({ page: 1, limit: 8 }));
    }
  }, []);

  const fetchMoreData = () => {
    if (hotPicksCurrentPage < hotPicksTotalPages && !hotPicksLoading) {
      dispatch(fetchMoreHotPicks({ page: hotPicksCurrentPage + 1, limit: 8 }));
    }
  };
  const { loadingProductId } = useSelector((state) => state.cart);
  const handleAddToCart = async (product) => {
    if (!user) {
      toast.error("Please log in to add products to your cart!");
      return;
    }
    dispatch(addToCart({ productId: product._id, quantity: 1 }));
  };

 

  return (
    <section className="max-w-7xl mx-auto p-2 sm:p-4 mb-8 pb-4">
     {hotPicks.length ? <h2 className="text-2xl font-bold mt-6 ml-3">Hot Picks</h2>:""}
      {hotPicks.length ? (
        <InfiniteScroll
          dataLength={hotPicks.length}
          next={fetchMoreData}
          hasMore={hotPicksCurrentPage < hotPicksTotalPages}
          loader={ <div className="grid min-h-[140px] w-full place-items-center overflow-x-scroll rounded-lg p-6 lg:overflow-visible">
            <svg className="w-16 h-16 animate-spin text-gray-900/50" viewBox="0 0 64 64" fill="none"
              xmlns="http://www.w3.org/2000/svg" width="24" height="24">
              <path
                d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
                stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"></path>
              <path
                d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
                stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" className="text-gray-900">
              </path>
            </svg>
          </div> }
          
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1 sm:gap-2 md:gap-3 mt-4"
        >
          {hotPicks.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg p-2 md:p-3  transition-shadow duration-300"
            >
              <Link href={`/product/${product._id}`}>
                <Image
                  width={300}
                  height={300}
                  loading="lazy"
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-[clamp(11rem,18vw,20rem)] object-cover rounded-lg"
                />
              </Link>
              <div className="mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-800">
                    {formatPrice(product.discountPrice)}
                  </span>
                  <strike className="text-xs text-gray-400">{formatPrice(product.price)}</strike>
                </div>
                <div className="text-sm text-gray-600 truncate">{product.name}</div>
                <div className="flex items-center mt-1 text-sm text-gray-500">
                  {/* <span className="text-[#F42222]">★</span>
                  <span>{product.averageRating.toFixed(1)}</span> */}
                  <Star rating={product.averageRating.toFixed(1)}/>
                </div>
              </div>
              <Button
                className="mt-4 bg-[#F8C0BF] hover:bg-[#fe6161] transition-colors py-2 px-4 rounded-md w-full capitalize text-sm"
                onClick={() => handleAddToCart(product)}
                disabled={loadingProductId === product._id}
              >
                {loadingProductId === product._id ? "Adding..." : "Add to Cart"}
              </Button>
            </div>
          ))}
        </InfiniteScroll>
      ) : (
        <div>
          <Skel.Item className="h-8 w-32 bg-gray-200 shimmer mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1 sm:gap-3 md:gap-6">
            {Array(8)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="space-y-4">
                  <Skel.Item className="w-full h-56 bg-gray-200 shimmer rounded-lg" />
                  <div className="flex justify-between">
                    <Skel.Item className="h-3 w-24 bg-gray-200 shimmer" />
                    <Skel.Item className="h-3 w-10 bg-gray-200 shimmer" />
                  </div>
                  <Skel.Item className="h-4 w-32 bg-gray-200 shimmer" />
                  <Skel.Item className="h-8 w-full rounded-md bg-gray-200 shimmer" />
                </div>
              ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default HotPicks;
