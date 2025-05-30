'use client';
import Footer from '@/components/HomePage/Footer';
import { formatPrice } from '@/utils/productDiscount';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
function formatDate(timestamp) {
    const date = new Date(timestamp);
  
    const day = date.getDate();
    const monthNames = [
      'January', 'February', 'Mart', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
  
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const amPm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert to 12-hour format
  
    const daySuffix = (d) => {
      if (d >= 11 && d <= 13) return 'th';
      switch (d % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };
  
    return `${day}${daySuffix(day)} ${month} ${year} at ${hours}:${minutes} ${amPm}`;
  }
export default function Page() {
    const { id } = useParams(); // Extracts `id` from the path, e.g., /myorderitems/[id]
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true); // Track loading state
    const steps = [
        { stat: "Order Received", date: "21st November, 2019" },
        { stat: "Order Processed", date: "21st November, 2019" },
        { stat: "Order Shipped", date: "21st November, 2019" },
        { stat: "Order Dispatched", date: "21st November, 2019" },
        { stat: "Order Delivered", date: "21st November, 2019" },
      ];
    
      const [currentStep, setCurrentStep] = useState(0);
    const navigate = useRouter();
      const incrementStep = () => {
        if (currentStep < steps.length - 1) {
          setCurrentStep(currentStep + 1);
        }
      };
    
      const decrementStep = () => {
        if (currentStep > 0) {
          setCurrentStep(currentStep - 1);
        }
      };

    useEffect(() => {
        if (id) {
            async function fetchOrderItems() {
                try {
                    
                    const response = await axios.get(`/api/orders/${id}`);
                    console.log(response.data);

                    setOrder(response.data.order); // Update state with the response data
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching order items:', error);
                    setLoading(false);
                }
            }

            fetchOrderItems();
        }
    }, [id]);

    return (
        <>
        {/* <div className="order-items-container p-4">
            {loading ? (
                <p>Loading...</p>
            ) : orderItems.length > 0 ? (
                orderItems.map((item) => (
                    item.productDetails ? (
                        <div key={item._id} className="order-item-card border p-4 rounded-lg shadow-lg mb-4">
                            <img
                                src={item.productDetails.images?.[0] || null} // Fallback to a placeholder if no image
                                alt={item.productDetails.name || 'Product Image'}
                                className="w-40 h-40 object-cover mb-2"
                            />
                            <h2 className="text-lg font-bold">{item.productDetails.name || 'Unnamed Product'}</h2>
                            <p className="text-sm text-gray-500">Price: ${item.productDetails.discountPrice ?? 'N/A'}</p>
                            <p className="text-sm text-gray-500">Original Price: ${item.productDetails.price ?? 'N/A'}</p>
                            <p className="text-sm text-gray-500">Quantity: {item.quantity ?? 'N/A'}</p>
                            <p className="text-red-500 text-sm cursor-pointer hover:underline">
                            <Link href={"/myitem"}>Track Order Status</Link>
                            </p>
                            
                        </div>
                    ) : (
                        <div key={item._id} className="order-item-card border p-4 rounded-lg shadow-lg mb-4">
                            <p className="text-red-500">Product details not available</p>
                        </div>
                    )
                ))
            ) : (
                <p>No items found.</p>
            )}
        </div> */}
<div className="py-14 px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto">

  <div className="flex justify-start item-start space-y-2 flex-col">
    <h1 className="text-2xl dark:text-white lg:text-4xl font-semibold leading-7 lg:leading-9 text-gray-800">Order : {order?.orderID}</h1>
    <p className="text-base dark:text-gray-300 font-medium leading-6 text-gray-600">{formatDate(order?.createdAt)}</p>
  </div>
  <div className="mt-10 flex flex-col xl:flex-row jusitfy-center items-stretch w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">
    <div className="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8">
      <div className="flex flex-col justify-start items-start dark:bg-gray-800 bg-gray-50 px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full">
        <div className=' flex justify-between items-center w-full '>
        <div className='p-7'><p className=' px-2 flex'>Order Status </p> <p className=' border-2 border-pink-500 text-pink-500 bg-pink-100 py-1 px-4 rounded-full'>{order?.orderStatus}</p></div>
        <div className='p-7'><p className='px-2 flex'>Payment Status </p> <p className=' border-2 border-pink-500 text-pink-500 bg-pink-100 py-1 px-4 rounded-full'>{order?.payment?.mode}</p></div>
        </div>
        <p className="text-lg md:text-xl dark:text-white font-semibold leading-6 xl:leading-5 text-gray-800">Customer’s Cart</p>
       { order?.items?.map((item,index) =><div key={index} onClick={()=>navigate.push(`/product/${item?.productId._id}`)} className="mt-4 md:mt-6 flex flex-col md:flex-row justify-start items-start md:items-center md:space-x-6 xl:space-x-8 w-full hover:cursor-pointer">
          <div className="pb-4 md:pb-8 w-full md:w-40">
            <Image className="w-full hidden md:block" src={process.env.NEXT_PUBLIC_IMAGE_URL +item?.productId?.images[0]} width={100} height={100} alt="dress" />
          </div>
          <div className="border-b border-gray-200 md:flex-row flex-col flex justify-between items-start w-full pb-8 space-y-4 md:space-y-0">
            <div className="w-full flex flex-col justify-start items-start space-y-8">
              <h3 className=" dark:text-white xl:text-2xl font-semibold leading-6 text-gray-800">{item.productId?.name} </h3>
              <div className="flex justify-start items-start flex-col space-y-2">
                <p className="text-sm dark:text-white leading-none text-gray-800"><span className="dark:text-gray-400 text-gray-300">Category: </span> {item?.productId?.category?.name } </p>
                <p className="text-sm dark:text-white leading-none text-gray-800"><span className="dark:text-gray-400 text-gray-300">metal: </span> {item?.productId?.metal}</p>
          
              </div>
            </div>
            <div className="flex justify-between space-x-8 items-start w-full">
              <p className="text-base dark:text-white xl:text-lg leading-6"> {formatPrice(item?.productId?.discountPrice)}<span className="text-red-300 line-through"> {formatPrice(item?.productId?.price)} </span></p>
              <p className="text-base dark:text-white xl:text-lg leading-6 text-gray-800">{item?.quantity}</p>
              <p className="text-base dark:text-white xl:text-lg font-semibold leading-6 text-gray-800">Rs.{item?.price}</p>
            </div>
          </div>
        </div>)}
        {/* <div className="mt-6 md:mt-0 flex justify-start flex-col md:flex-row items-start md:items-center space-y-4 md:space-x-6 xl:space-x-8 w-full">
          <div className="w-full md:w-40">
            <img className="w-full hidden md:block" src="https://i.ibb.co/s6snNx0/Rectangle-17.png" alt="dress" />
            <img className="w-full md:hidden" src="https://i.ibb.co/BwYWJbJ/Rectangle-10.png" alt="dress" />
          </div>
          <div className="flex justify-between items-start w-full flex-col md:flex-row space-y-4 md:space-y-0">
            <div className="w-full flex flex-col justify-start items-start space-y-8">
              <h3 className="text-xl dark:text-white xl:text-2xl font-semibold leading-6 text-gray-800">High Quaility Italic Dress</h3>
              <div className="flex justify-start items-start flex-col space-y-2">
                <p className="text-sm dark:text-white leading-none text-gray-800"><span className="dark:text-gray-400 text-gray-300">Style: </span> Italic Minimal Design</p>
                <p className="text-sm dark:text-white leading-none text-gray-800"><span className="dark:text-gray-400 text-gray-300">Size: </span> Small</p>
                <p className="text-sm dark:text-white leading-none text-gray-800"><span className="dark:text-gray-400 text-gray-300">Color: </span> Light Blue</p>
              </div>
            </div>
            <div className="flex justify-between space-x-8 items-start w-full">
              <p className="text-base dark:text-white xl:text-lg leading-6">$20.00 <span className="text-red-300 line-through"> $30.00</span></p>
              <p className="text-base dark:text-white xl:text-lg leading-6 text-gray-800">01</p>
              <p className="text-base dark:text-white xl:text-lg font-semibold leading-6 text-gray-800">$20.00</p>
            </div>
          </div>
        </div> */}
      </div>
      <div className="flex justify-center  md:flex-row flex-col items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
        <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 dark:bg-gray-800 space-y-6">
          <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">Summary</h3>
          {/* <div className="flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4">
            <div className="flex justify-between w-full">
              <p className="text-base dark:text-white leading-4 text-gray-800">Subtotal</p>
              <p className="text-base dark:text-gray-300 leading-4 text-gray-600">$56.00</p>
            </div>
            <div className="flex justify-between items-center w-full">
              <p className="text-base dark:text-white leading-4 text-gray-800">Discount <span className="bg-gray-200 p-1 text-xs font-medium dark:bg-white dark:text-gray-800 leading-3 text-gray-800">STUDENT</span></p>
              <p className="text-base dark:text-gray-300 leading-4 text-gray-600">-$28.00 (50%)</p>
            </div>
            <div className="flex justify-between items-center w-full">
              <p className="text-base dark:text-white leading-4 text-gray-800">Shipping</p>
              <p className="text-base dark:text-gray-300 leading-4 text-gray-600">$8.00</p>
            </div>
          </div> */}
          <div className="flex justify-between items-center w-full">
            <p className="text-base dark:text-white font-semibold leading-4 text-gray-800">Total Amount</p>
            <p className="text-base dark:text-gray-300 font-semibold leading-4 text-gray-600">{formatPrice(order?.amount)}</p>
          </div>
        </div>
        <div className="flex flex-col justify-center px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 dark:bg-gray-800 space-y-6">
          <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">Shipping</h3>
          <div className="flex justify-between items-start w-full">
            <div className="flex justify-center items-center space-x-4">
              <div className="w-8 h-8">
                <img className="w-full h-full" alt="logo" src="https://i.ibb.co/L8KSdNQ/image-3.png" />
              </div>
              <div className="flex flex-col justify-start items-center">
                <p className="text-lg leading-6 dark:text-white font-semibold text-gray-800">Shiprocket Delivery<br /><span className="font-normal">Delivery with 24 Hours</span></p>
              </div>
            </div>
            <p className="text-lg font-semibold leading-6 dark:text-white text-gray-800">Rs 0.00</p>
          </div>
          <div className="w-full flex flex-col justify-center items-center">
          {/* <div className="order-track mt-8 pt-6 border-t border-dashed border-[#2c3e50]">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex items-center h-28 transition-all duration-500 ease-in-out ${
              index === currentStep ? 'text-[#f05a00]' : 'text-gray-400'
            }`}
          >
            <div className="relative mr-6">
              <span
                className={`block w-5 h-5 rounded-full transition-colors duration-500 ${
                  index <= currentStep ? 'bg-[#f05a00]' : 'bg-gray-300'
                }`}
              ></span>
              {index < steps.length - 1 && (
                <span
                  className={`block w-[2px] h-28 transition-colors duration-500 ${
                    index < currentStep ? 'bg-[#f05a00]' : 'bg-gray-300'
                  } absolute top-5 left-1/2 transform -translate-x-1/2`}
                ></span>
              )}
            </div>
            <div>
              <p className="text-lg font-semibold">{step.stat}</p>
              <span className="text-sm font-light">{step.date}</span>
            </div>
          </div>
        ))}
      </div> */}

      {/* <div className="flex justify-between mt-6">
        <button
          onClick={decrementStep}
          disabled={currentStep === 0}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={incrementStep}
          disabled={currentStep === steps.length - 1}
          className="px-4 py-2 bg-[#f05a00] text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div> */}
          </div>
        </div>
      </div>
    </div>
    <div className="bg-gray-50 dark:bg-gray-800 w-full xl:w-96 flex justify-between items-center md:items-start px-4 py-6 md:p-6 xl:p-8 flex-col">
      <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">Customer</h3>
      <div className="flex flex-col md:flex-row xl:flex-col justify-start items-stretch h-full w-full md:space-x-6 lg:space-x-8 xl:space-x-0">
        <div className="flex flex-col justify-start items-start flex-shrink-0">
          <div className="flex justify-center w-full md:justify-start items-center space-x-4 py-8 border-b border-gray-200">
            <Image height={30} width={30} src="/images/user.svg" alt="avatar" />
            <div className="flex justify-start items-start flex-col space-y-2">
              <p className="text-base dark:text-white font-semibold leading-4 text-left text-gray-800">{order?.customer?.name}</p>
              {/* <p className="text-sm dark:text-gray-300 leading-5 text-gray-600">10 Previous Orders</p> */}
            </div>
          </div>

          <div className="flex justify-center text-gray-800 dark:text-white md:justify-start items-center space-x-4 py-4 border-b border-gray-200 w-full">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M3 7L12 13L21 7" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <p className="cursor-pointer text-sm leading-5 ">{order?.customer?.email}</p>
          </div>
        </div>
        <div className="flex justify-between xl:h-full items-stretch w-full flex-col mt-6 md:mt-0">
          <div className="flex justify-center md:justify-start xl:flex-col flex-col md:space-x-6 lg:space-x-8 xl:space-x-0 space-y-4 xl:space-y-12 md:space-y-0 md:flex-row items-center md:items-start">
            <div className="flex justify-center md:justify-start items-center md:items-start flex-col space-y-4 xl:mt-8">
              <p className="text-base dark:text-white font-semibold leading-4 text-center md:text-left text-gray-800">Shipping Address</p>
              <p className="w-48 lg:w-full dark:text-gray-300 xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">{order?.customer?.name}</p>
              <p className="w-48 lg:w-full dark:text-gray-300 xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">{order?.customer?.address}</p>
              <p className="w-48 lg:w-full dark:text-gray-300 xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">{order?.customer?.city}, {order?.customer?.state} {order?.customer?.country} - {order?.customer?.pincode}</p>
             
            </div>
            <div className="flex justify-center md:justify-start items-center md:items-start flex-col space-y-2">
              <p className="text-base dark:text-white font-semibold leading-4 text-center md:text-left text-gray-800">Billing Address</p>
              <p className="w-48 lg:w-full dark:text-gray-300 xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">{order?.customer?.name}</p>
              <p className="w-48 lg:w-full dark:text-gray-300 xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">{order?.customer?.address}</p>
              <p className="w-48 lg:w-full dark:text-gray-300 xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">{order?.customer?.city}, {order?.customer?.state} {order?.customer?.country} - {order?.customer?.pincode}</p>
            </div>
          </div>
          <div className="flex w-full justify-center items-center md:justify-start md:items-start">
            {/* <button className="mt-6 md:mt-0 dark:border-white dark:hover:bg-gray-900 dark:bg-transparent dark:text-white py-5 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 border border-gray-800 font-medium w-96 2xl:w-full text-base font-medium leading-4 text-gray-800">Edit Details</button> */}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
        <Footer/>
        </>
    );
}
