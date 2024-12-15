// import React from 'react'
import Star from '@/assets/Star.svg'
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation, Pagination, Autoplay } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';
// import 'swiper/css/scrollbar';

// import 'swiper/css/autoplay';

// export default function Testimonials() {
//   const reviews = [
//     {
//       id: 1,
//       name: "Ankita Sharma",
//       image: "https://via.placeholder.com/150",
//       review: "\"I'm absolutely in love with my new silver necklace! It's delicate, elegant, and the perfect finishing touch to my outfit. The quality is exceptional, and it feels so luxurious on my skin. Highly recommend!\"",
//     },
//     {
//       id: 2,
//       name: "Rajesh Kumar",
//       image: "https://via.placeholder.com/150",
//       review: " \"I'm so impressed with the quality of this silver ring. It\'s well\-made, comfortable to wear, and the stone sparkles beautifully. JENII has exceeded my expectations. I'll definitely be shopping here again.\"",
//     },
//     {
//       id: 3,
//       name: "Aafreen Khan",
//       image: "https://via.placeholder.com/150",
//       review: "\"This silver bracelet is a true gem. It's delicate, elegant, and perfect for everyday wear. The packaging was also top-notch. I'm satisfied with my purchase!\"",
//     },
//     {
//       id: 4,
//       name: "Priyanka Singh",
//       image: "https://via.placeholder.com/150",
//       review: "\"The earrings are lovely and they're very stylish and affordable. I'd recommend cleaning them regularly to maintain their shine.\"",
//     },
//     {
//       id: 5,
//       name: "Neha Gupta",
//       image: "https://via.placeholder.com/150",
//       review: "\"This silver pendant necklace is beautiful, but the chain could be a bit sturdier. Overall, it's a good value for the price. I'm happy with my purchase.\"",
//     },
//   ];
//   return (
//     <>
// <section className="bg-gray-50">
//   <div className="mx-auto max-w-screen-2xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
//     <div className="md:flex md:items-end md:justify-between">
//       <div className="max-w-xl">
//         <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
//           Read trusted reviews from our customers
//         </h2>
//         <p className="mt-6 max-w-lg leading-relaxed text-gray-700">
//           Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur praesentium natus
//           sapiente commodi. Aliquid sunt tempore iste repellendus explicabo dignissimos placeat,
//           autem harum dolore reprehenderit quis! Quo totam dignissimos earum.
//         </p>
//       </div>

//     </div>

//     <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
//     <Swiper
//       modules={[Navigation, Pagination, Autoplay]}
//       slidesPerView={1}
//       navigation
//       autoplay={{ delay: 1000 }}
//       pagination={{ clickable: true }}
//     >
//         {reviews.map(({ id, name, image, review }) => (
//           <SwiperSlide key={id}>
//       <blockquote className="flex h-full flex-col justify-between bg-white p-6 shadow-sm sm:p-8">
//         <div>
//         <img
//                 src={image}
//                 alt={name}
//                 className="w-24 h-24 rounded-full mb-4 border-2 border-blue-500"
//               />
//           <div className="flex gap-0.5 text-pink-200">
//           {Array(5).fill(0).map((_, index) => (
//             <span className='w-6' key={index}><Star/></span>
//           ))}

//           </div>

//           <div className="mt-4">
//             <p className="text-2xl font-bold text-rose-600 sm:text-3xl">{name}</p>

//             <p className="mt-4 leading-relaxed text-gray-700">
//            {review}
//             </p>
//           </div>
//         </div>

//         <footer className="mt-4 text-sm font-medium text-gray-700 sm:mt-6">
//           &mdash; Ankita Sharma
//         </footer>
//       </blockquote>
//       </SwiperSlide>
//     ))}
//     </Swiper>

//       {/* <blockquote className="flex h-full flex-col justify-between bg-white p-6 shadow-sm sm:p-8">
//         <div>
//           <div className="flex gap-0.5 text-green-500">
//             <span className='w-6'><Star/></span>

//             <span className='w-6'><Star/></span>

//             <span className='w-6'><Star/></span>

//             <span className='w-6'><Star/></span>

//             <span className='w-6'><Star/></span>
//           </div>

//           <div className="mt-4">
//             <p className="text-2xl font-bold text-rose-600 sm:text-3xl">Rajesh Kumar</p>

//             <p className="mt-4 leading-relaxed text-gray-700">
//             "I'm so impressed with the quality of this silver ring. It's well-made, comfortable to wear, and the stone sparkles beautifully. JENII has exceeded my expectations. I'll definitely be shopping here again."
//             </p>
//           </div>
//         </div>

//         <footer className="mt-4 text-sm font-medium text-gray-700 sm:mt-6">
//           &mdash; Rajesh Kumar
//         </footer>
//       </blockquote>

//       <blockquote className="flex h-full flex-col justify-between bg-white p-6 shadow-sm sm:p-8">
//         <div>
//           <div className="flex gap-0.5 text-green-500">
//             <span className='w-6'><Star/></span>

//             <span className='w-6'><Star/></span>

//             <span className='w-6'><Star/></span>

//             <span className='w-6'><Star/></span>

//             <span className='w-6'><Star/></span>
//           </div>

//           <div className="mt-4">
//             <p className="text-2xl font-bold text-rose-600 sm:text-3xl">Priyanka Singh</p>

//             <p className="mt-4 leading-relaxed text-gray-700">
//             "The earrings are lovely and they're very stylish and affordable. I'd recommend cleaning them regularly to maintain their shine."
//             </p>
//           </div>
//         </div>

//         <footer className="mt-4 text-sm font-medium text-gray-700 sm:mt-6">
//           &mdash;Priyanka Singh
//         </footer>
//       </blockquote> */}
//     </div>
//   </div>
// </section>
//     </>
//   )
// }
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { EffectCoverflow, Pagination, Navigation, Autoplay } from 'swiper/modules';

// import slide_image_1 from './assets/images/img_1.jpg';
// import slide_image_2 from './assets/images/img_2.jpg';
// import slide_image_3 from './assets/images/img_3.jpg';
// import slide_image_4 from './assets/images/img_4.jpg';
// import slide_image_5 from './assets/images/img_5.jpg';
// import slide_image_6 from './assets/images/img_6.jpg';
// import slide_image_7 from './assets/images/img_7.jpg';

function Testimonials() {
    const reviews = [
    {
      id: 1,
      name: "Ankita Sharma",
      image: "/testimonials-2.jpg",
      review: "\"I'm absolutely in love with my new silver necklace! It's delicate, elegant, and the perfect finishing touch to my outfit. The quality is exceptional, and it feels so luxurious on my skin. Highly recommend!\"",
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      image: "/testimonials-1.jpg",
      review: " \"I'm so impressed with the quality of this silver ring. It\'s well\-made, comfortable to wear, and the stone sparkles beautifully. JENII has exceeded my expectations. I'll definitely be shopping here again.\"",
    },
    {
      id: 3,
      name: "Aafreen Khan",
      image: "/testimonials-4.jpg",
      review: "\"This silver bracelet is a true gem. It's delicate, elegant, and perfect for everyday wear. The packaging was also top-notch. I'm satisfied with my purchase!\"",
    },
    {
      id: 4,
      name: "Priyanka Singh",
      image: "/testimonials-3.jpg",
      review: "\"The earrings are lovely and they're very stylish and affordable. I'd recommend cleaning them regularly to maintain their shine.\"",
    },
    {
      id: 5,
      name: "Neha Gupta",
      image: "/testimonials-6.jpg",
      review: "\"This silver pendant necklace is beautiful, but the chain could be a bit sturdier. Overall, it's a good value for the price. I'm happy with my purchase.\"",
    },
   { id: 6,
      name: "Rajesh Kumar",
      image: "/testimonials-5.jpg",
      review: " \"I'm so impressed with the quality of this silver ring. It\'s well\-made, comfortable to wear, and the stone sparkles beautifully. JENII has exceeded my expectations. I'll definitely be shopping here again.\"",
    }
  ];
  const [value, setValue] = useState(getValueBasedOnWidth());

  // Function to determine the value based on screen width
  function getValueBasedOnWidth() {
    const width = window.innerWidth;
    if (width < 640) return 1; // Small screens (e.g., mobile)
    if (width < 1024) return 2; // Medium screens (e.g., tablets)
    return 3; // Large screens (e.g., desktops)
  }

  // Update value on window resize
  useEffect(() => {
    const handleResize = () => {
      setValue(getValueBasedOnWidth());
    };

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call the function initially to set the correct value
    handleResize();

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <section className="" style={{ backgroundImage: "url('/bg.png')" }}>
   <div className="mx-auto max-w-screen-2xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16 ">
       <div className="max-w-xl mb-12">
         <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
           Read trusted reviews from our customers
         </h2>
         <p className="mt-6 max-w-lg leading-relaxed text-gray-700">
           Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur praesentium natus
           sapiente commodi. Aliquid sunt tempore iste repellendus explicabo dignissimos placeat,
           autem harum dolore reprehenderit quis! Quo totam dignissimos earum.
         </p>
       </div>

      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        slidesPerView={value}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 2.5,
        }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ el: '.swiper-pagination', clickable: true }}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
          clickable: true,
        }}
        modules={[EffectCoverflow, Pagination, Navigation,Autoplay]}
        className="swiper_container "
      >
        {reviews.map(({ id, name, image, review }) => (
          <SwiperSlide key={id}>
      <blockquote className="flex h-full flex-col justify-between bg-white p-6 shadow-sm sm:p-8  rounded-xl">
        <div>
        <img
                src={image}
                alt={name}
                className="w-24 h-24 rounded-full mb-4 border-2 border-blue-500"
              />
          <div className="flex gap-0.5 text-pink-200">
          {Array(5).fill(0).map((_, index) => (
            <span className='w-6' key={index}><Star/></span>
          ))}

          </div>

          <div className="mt-4">
            <p className="text-2xl font-bold text-rose-600 sm:text-3xl">{name}</p>

            <p className="mt-4 leading-relaxed text-gray-700">
           {review}
            </p>
          </div>
        </div>

        <footer className="mt-4 text-sm font-medium text-gray-700 sm:mt-6">
          &mdash;{name}
        </footer>
      </blockquote>
      </SwiperSlide>
    ))}

        <div className="slider-controler">
          {/* <div className="swiper-button-prev slider-arrow">
            <ion-icon name="arrow-back-outline"></ion-icon>
          </div>
          <div className="swiper-button-next slider-arrow">
            <ion-icon name="arrow-forward-outline"></ion-icon>
          </div> */}
          <div className="swiper-pagination"></div>
        </div>
      </Swiper>
       </div>

</section>

  );
}

export default Testimonials;