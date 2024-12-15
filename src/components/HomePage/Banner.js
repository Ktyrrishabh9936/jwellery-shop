"use client"
import { Carousel } from "@/MaterialTailwindNext";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { getAboutSlides, getHeroSlides } from "@/lib/reducers/slidesReducer";
import { useEffect } from "react";
import toast from "react-hot-toast";
export default function Banner() {
  const dispatch = useAppDispatch();

  const {aboutSlides,heroloading,isaboutfetched,aboutFetcherror}= useAppSelector((state)=>state.slides)
  useEffect(()=>{
    const handleGetSlides = async () => {
      try {
        if(!isaboutfetched){
          dispatch(getAboutSlides())
        }
      } catch (err) {
        console.error("Error getting Slides", aboutFetcherror);
        toast.error("Error getting Slides")
      }
  
    };
    handleGetSlides();
  },[])
  if(heroloading){
    return <div className="mx-auto h-[clamp(8rem,16vw,26rem)] w-[96%] bg-gray-200 shimmer rounded-xl" />
   }
        return (
                <>
     <Carousel className="rounded-xl h-[clamp(8rem,16vw,26rem)] w-[96%] mx-auto" 
     autoplay autoplayDelay={10000} loop
     >
      {aboutSlides?.map((item,index)=>  
       {return <Image width={900} height={300} 
        loading="lazy"
       key={index}
         src={item.desktopBannerImage}
         alt={`Banner ${index}`}
         className="h-full w-full object-cover"
       />})}

     </Carousel>

          </>
        );
      }
      