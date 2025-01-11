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
           return(rating >= index+1 ? <TiStarFullOutline   style={{fontSize:size,color}} /> : number >= index+1 ? <TiStarHalfOutline style={{fontSize:size,color}}/> : <TiStarOutline   style={{fontSize:size,color}}/>)
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
      dispatch(fetchHotPicks({ page: 1, limit: 10 }));
    }
  }, []);

  const fetchMoreData = () => {
    if (hotPicksCurrentPage < hotPicksTotalPages && !hotPicksLoading) {
      dispatch(fetchMoreHotPicks({ page: hotPicksCurrentPage + 1, limit: 10 }));
    }
  };

  const handleAddToCart = async (product) => {
    if (!user) {
      toast.error("Please log in to add products to your cart!");
      return;
    }
    dispatch(addToCart({ productId: product._id, quantity: 1 }));
  };

  const { loadingProductId } = useSelector((state) => state.cart);

  return (
    <section className="max-w-7xl mx-auto p-2 sm:p-4 mb-8 pb-4">
     {hotPicks.length ? <h2 className="text-2xl font-bold mt-6 ml-3">Hot Picks</h2>:""}
      {hotPicks.length ? (
        <InfiniteScroll
          dataLength={hotPicks.length}
          next={fetchMoreData}
          hasMore={hotPicksCurrentPage < hotPicksTotalPages}
          loader={<ProductGridLoader/>}
          endMessage={
            <p className="text-center text-gray-500 mt-4">You have seen all the products!</p>
          }
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
