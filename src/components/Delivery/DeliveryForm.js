"use client";
import Script from "next/script";
import axios from "axios";
import {  Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {  useEffect, useState } from "react";
import { Select, Option } from "@/MaterialTailwindNext";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { addAddress, fetchAddresses, getAddress } from "@/lib/reducers/addressReducer";

import { useSession } from "next-auth/react";
import { applyCoupon, clearCart } from "@/lib/reducers/cartReducer";
import AddressList from "./adddressList";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import Addressform from "./Addressform";

import { motion } from "framer-motion";
import Image from "next/image";
import { LoaderPinwheel } from "lucide-react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { BiLoaderCircle } from "react-icons/bi";
import * as Yup from "yup";
const DeliveryForm = () => {
  const navigate  = useRouter();
  const dispatch  = useDispatch();
  const {Items,coupon ,couponDiscount,loadingCoupon } = useSelector((state)=>state.cart);
  
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("Prepaid");
  const { addresses, loading, error } = useSelector((state) => state.address);
  const {user} = useSelector((state)=>state.user);
  const [showThankYou, setShowThankYou] = useState(false);
  const session = useSession();

 const AddressSchema = Yup.object().shape({
    email:user ? Yup.string().email("Invalid Email") :Yup.string().email("Invalid Email").required("Email is not verified"),
    firstName:Yup.string().required("First Name is required"),
    lastName:Yup.string().required("Last Name is required"),
    contact:Yup
    .string()
    .matches(/^\d{7,15}$/, "Phone number must be between 7-15 digits")
    .required("Phone number is required"),
    addressline1:  Yup.string().required("Address Line 1 is required"),
    addressline2:  Yup.string(),
    city:  Yup.object().required("City is required"),
    state:Yup.object().required("State is required"),
    country: Yup.object().required("Country is required"),
    postalCode: Yup.string().required("postalCode is required").matches(/^[0-9]{6}$/, "Must be a valid 6-digit postalCode"),
    landmark: Yup.string(),
    countryCode: Yup.string().required("Country code is required"),
 } );

  useEffect(() => {
    if(session.status === "authenticated" && addresses.length === 0){
    dispatch(fetchAddresses())
    }
    if(!coupon){
      const couponCode = Cookies.get("cpn-cde");
      if (couponCode) { dispatch(applyCoupon({couponCode})) }
      }
  }, []);

  useEffect(() => {
    if(addresses.length){
    setSelectedAddress(addresses[0])
    }
  }, [addresses]);
  
  const { register, handleSubmit,control,setValue, formState: { errors },reset,watch  } = useForm({
    resolver: yupResolver(AddressSchema) , defaultValues:{countryCode:"+91",email:user ? user?.email : ""}
  });

  const [isLoading, setIsLoading] = useState(false);
  const verifiedEmail = watch("email");

  const handleAddAddress = (address) => {
      dispatch(addAddress(address));
    setIsModalOpen(false);
  };


  const handleCreateNewAddress = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    reset();
     }
     const [timer, setTimer] = useState(30);
     const [isResendDisabled, setIsResendDisabled] = useState(false);
   
     useEffect(() => {
       if (timer > 0) {
         const interval = setInterval(() => {
           setTimer((prev) => prev - 1);
         }, 1000);
         return () => clearInterval(interval);
       } else {
         setIsResendDisabled(false);
       }
     }, [timer]);
     const [email, setEmail] = useState('');
  const [getotperror, setgetotpError] = useState('');
  const [getotpLoading, setgetotpLoading] = useState(false);
  const [hashedOTP, setHashedOTP] = useState(null);

  const getOtpverifyEmail = async (e) => {
    setgetotpError("");
    e.preventDefault();
    if (!email) {
      setgetotpError('Email is required.');
    } else {
      setgetotpLoading(true);
      setgetotpError('');
      try {
        const response = await axios.post('/api/users/send-email-otp', { email });
        if (response.data.hashedOTP) {
          setHashedOTP(response.data.hashedOTP); // Store hashed OTP in state
          setgetotpLoading(false);
          setTimer(30);
    setIsResendDisabled(true);
    setshowotp(true)

        }
        if (response.data.message) {
          toast.success(response.data.message); 
        }
      } catch (error) {
        console.error('Error sending OTP:', error);
        setgetotpError('Failed to send OTP.');
        setgetotpLoading(false);
        toast.error('Failed to send OTP. Please try again.'); 
      }
    }
  };
  const [showotp, setshowotp] = useState('');
  const [userId, setUserId] = useState('');
  const [verifyOtp, setverifyOtp] = useState('');
  const [verifyOtperror, setverifyOtpError] = useState('');
  const [verifyOtpLoading, setverifyOtpLoading] = useState(false);
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!verifyOtp) {
      setverifyOtpError('OTP is required.');
    } else {
      setverifyOtpLoading(true);
      setverifyOtpError('');
      try {
        const response = await axios.post('/api/users/mail-verify-otp', {email, otp:verifyOtp , hashedOTP });
        toast.success(response.data.message); 
        console.log(response.data)
        setValue("email",email)
        setUserId(response.data.userId);
        setverifyOtpLoading(false);
      } catch (error) {
        console.log(error)
        setverifyOtpError('Failed to verify OTP.');
        toast.error('Failed to verify OTP. Please try again.'); 
        setverifyOtpLoading(false);
      }
    }
  };
  const onSubmitPrepaid = async (formdata) => {
    try {
      setIsLoading(true);
    
      const {data} = await axios.post("/api/payment/create-order" ,{Items,couponCode:coupon?.couponCode,userId});
      const {order,amount} = data;
      console.log(data)
      console.log("Order placed successfully");
      const { key, ...restProps } = {
        key:process.env.RAZORPAY_KEY_ID, // Razorpay Key ID
        amount: order.amount,
        currency: order.currency,
        name: "Jenii JP Sterling Silver",
        description: "Purchase Product",
        image: "https://cdn.bio.link/uploads/profile_pictures/2024-10-07/WpsNql0qow0baLnfnBowFm8v5fK9twVm.png", // Optional
        order_id: order.id, // Backend Order ID
        handler: async function (response) {
          // Payment successful, send data to backend
          console.log(response)
          const orderData = {
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
            amount,
            address:formdata,
            Items,userId,couponCode:coupon?.couponCode
          };

          const result = await axios.post(
            `/api/payment/verify-payment/`,
            orderData
          );

          setShowThankYou(true);

          // Clear the cart and navigate after animation
          setTimeout(() => {
            dispatch(clearCart());
            if(user){
            navigate.push("/orders");
            }else{
              navigate.push("/");
            }
          }, 5000); // 5 seconds delay for animation
        },
        prefill: {
          name: formdata.name,
          email: user ? user?.email : verifiedEmail, // Optional
          contact: formdata.contact,
        },
        theme: {
          color: "#F37254",
        },
      };
      const razorpay = new window.Razorpay({ key, ...restProps });
      razorpay.open();
      razorpay.on("payment.failed", function (response) {
        alert("Payment failed. Please try again. Contact support for help");
      });
    } catch (error) {
      console.log("Error in submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleCODPayment = async (formdata) => {
    try {
      // Process the order without payment
      setIsLoading(true);
      console.log("COD",{Items,couponCode:coupon?.couponCode,userId,address:formdata})
      console.log("COD selected, order will be processed without payment.");
      const {data} = await axios.post("/api/payment/cod-order" ,{Items,couponCode:coupon?.couponCode,userId,address:formdata});
      console.log(data);
      setIsLoading(false);
      dispatch(clearCart());
      setShowThankYou(true);

          // Clear the cart and navigate after animation
          setTimeout(() => {
            dispatch(clearCart());
            if(user){
              navigate.push("/orders");
              }else{
                navigate.push("/");
              }
          }, 5000); // 5 seconds delay for animation
    } catch (error) {
      console.error("COD payment processing failed:", error);
      setIsLoading(false);
    }
  };




  

  return (
    <> 
    <Script
    id="razorpay-checkout-js"
    src="https://checkout.razorpay.com/v1/checkout.js"
  />
  {showThankYou ? (<motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 flex items-center justify-center bg-white z-50"
        >
          <div className="text-center">
            <Image
            width={40}
            height={40}
              src="/thank-you-animation.gif" // Replace with your animation/gif
              alt="Thank You"
              className="w-40 h-40 mx-auto"
            />
            <h2 className="text-xl font-bold mt-4">Thank You for Your Order!</h2>
            <p className="text-gray-600 mt-2">Your order was placed successfully.</p>
          </div>
        </motion.div>):""}
    <form  className="max-w-lg mx-auto p-4 text-black space-y-4">
      {/* Delivery Section */}
      
      {loadingCoupon ?  <div className=" flex justify-center items-center text-teal-500"> <BiLoaderCircle /> </div> : coupon && <div class="bg-green-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md" role="alert">
  <div class="flex">
    <div class="py-1"><svg class="fill-current h-6 w-6 text-teal-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
    <div>
      <p class="font-bold">{coupon?.couponCode} applied</p>
      <p class="text-sm">You saved {couponDiscount.toFixed(2)} on this order</p>
    </div>
  </div> 
</div>
  }

      {!user && <><h2 className="text-xl font-bold mb-4">Contact</h2>

     {userId ?<div className=" flex flex-wrap justify-between" > <p className=" text-gray-700 " ><strong>Account:</strong><span>{verifiedEmail}</span></p> <span className=" text-green-700">Verified</span> </div>: verifyOtpLoading ?  <div className=" inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-10">
          <div className="animate-spin">
            <LoaderPinwheel size={50} className="text-pink-400" />
          </div>
        </div>:<div> <div className="relative flex h-10 w-full min-w-[200px] max-w-lg">
 <button type="submit"
    className="absolute bg-gray-800 right-0  h-[95%]  select-none rounded text-white py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase  shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none peer-placeholder-shown:pointer-events-none peer-placeholder-shown:bg-blue-gray-500 peer-placeholder-shown:opacity-50 peer-placeholder-shown:shadow-none"
    data-ripple-light="true"
    onClick={getOtpverifyEmail}
    disabled={getotpLoading || isResendDisabled}
  >
    {getotpLoading ? (
          <div className="h-5 w-5  border-t-transparent border-solid animate-spin rounded-full border-white-500 border-4 mx-3"></div>
        ) : "Verify"}
      
  </button>
  <input
    className={`peer h-full w-full rounded-[7px] border-l-[1px] border-b-[1px] border-r-[1px] border-blue-gray-200 bg-transparent px-3 py-2.5 pr-20 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200  focus:border-2 focus:border-gray-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 ${
      errors.email  ? "border-red-500" : "border-blue-gray-100"
    }`}
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    type="email"
  />
  
  
  <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
    Email
  </label>
</div>


{getotperror && <p className="text-red-500 text-sm">{ getotperror}</p>}
{showotp && <div className="transition-all">
 <div >
          <div className="mb-4">
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700">OTP</label>
           <div className=" flex ">
            <input
              type="text"
              id="otp"
              className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              value={verifyOtp}
              maxLength={6}
              onChange={(e) => setverifyOtp(e.target.value)}
            />
               <button
                type="button"
                className="px-4 py-2 bg-[#BC264B] text-white rounded-md hover:bg-red-700 transition-colors whitespace-nowrap"
                onClick={handleVerifyOtp}
              >
               Verify OTP
              </button>
            </div> 
            {verifyOtperror && <p className="text-red-500 text-sm mt-2">{verifyOtperror}</p>}
          </div>
        </div></div>}
        {isResendDisabled && <p className="text-gray-600">Resend in 00:{timer}s</p>}
        { errors.email && <p className="text-red-500 text-sm">{ errors.email.message }</p> } </div> }</>}


      <h2 className="text-xl font-bold mb-4">Delivery</h2>
      
  {/* {address.length ?   <div>

        
      <Controller
                name="selectedDetails"
                control={control}
                render={({ field }) => (      
                  <Select label="Select Delivery Details" selected={() =>  <div className=" line-clamp-1">{selectedAdress}</div>
                }  onChange={handleAddress} >
              {address?.map((item,index) => (
                  <Option key={index} value={index}>
                    <div>
                  <p >Name :{`${item.firstName} ${item.lastName} `}</p>
                  <p >Phone :{`${item.contact}  `}</p>
                  <p >Address :{` ${item.landmark} ${item.street} ${item.city} ${item.state} - ${item.postalCode} `}</p>
                  </div>
                  </Option>
                ))}
        </Select>)}/>
      {errors.addressSelect && <p className="text-red-500 text-sm">{errors.addressSelect.message}</p>}
        </div>:""} */}

{user ?<div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <AddressList addresses={addresses} selectedAddress={selectedAddress} setSelectedAddress={setSelectedAddress} />
      <button type="button" className="relative w-full flex justify-center items-center px-5 py-2.5 font-medium tracking-wide text-white capitalize bg-pink-600 rounded-md hover:bg-pink-700 focus:outline-none transition duration-300 transform active:scale-95 ease-in-out mt-3" onClick={handleCreateNewAddress}>
        <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF">
          <g>
            <rect fill="none" height="24" width="24"></rect>
          </g>
          <g>
            <g>
              <path d="M19,13h-6v6h-2v-6H5v-2h6V5h2v6h6V13z"></path>
            </g>
          </g>
        </svg>
        <span className="pl-2 mx-1">Create new shipping label</span>
      </button>

      <Dialog open={isModalOpen} onClose={closeModal} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black opacity-30" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md bg-white rounded-lg p-6">
            <DialogTitle className="text-lg font-medium text-gray-900">Add New Address</DialogTitle>
           <Addressform register={register} errors={errors} setValue={setValue} watch={watch} control={control}/>
         <div className="flex flex-row-reverse p-3">
               <div className="flex-initial pl-3">
                  <button type="button" onClick={handleSubmit(handleAddAddress)} className="flex items-center px-5 py-2.5 font-medium tracking-wide text-white capitalize   bg-pink-400 rounded-md  focus:outline-none hover:bg-pink-600   transition duration-300 transform active:scale-95 ease-in-out">
                     <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF">
                        <path d="M0 0h24v24H0V0z" fill="none"></path>2468
                        <path d="M5 5v14h14V7.83L16.17 5H5zm7 13c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-8H6V6h9v4z" opacity=".3"></path>
                        <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm2 16H5V5h11.17L19 7.83V19zm-7-7c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM6 6h9v4H6z"></path>
                     </svg>
                     <span className="pl-2 mx-1">Save</span>
                  </button>
               </div>
               <div className="flex-initial">
                  <button type="button" className="flex items-center px-5 py-2.5 font-medium tracking-wide text-black capitalize rounded-md  hover:bg-red-200 hover:fill-current hover:text-red-600  focus:outline-none  transition duration-300 transform active:scale-95 ease-in-out" onClick={closeModal}>
             
                     <span className="pl-2 mx-1">Cancel</span>
                  </button>
               </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div> :   <Addressform register={register} errors={errors} setValue={setValue} watch={watch} control={control}/>}
        
       

      {/* <h2 className="text-xl font-bold mb-4">Apply Coupon</h2>
      <input
        type="text"
        placeholder="Search"
        className="border bg-[#F2F2F2] text-black rounded-lg p-3 w-full md:w-1/2 mb-6"
      /> */}
      

<div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Payment</h3>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <label htmlFor="credit-card" className="rounded-lg border border-gray-200 bg-gray-50 p-4 ps-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-start">
            <div className="flex h-5 items-center">
              <input
                id="credit-card"
                aria-describedby="credit-card-text"
                type="radio"
                name="payment-method"
                value="Prepaid"
                checked={paymentMethod === "Prepaid"}
                onChange={() => setPaymentMethod("Prepaid")}
                className="h-4 w-4 border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
              />
            </div>

            <div className="ms-4 text-sm">
              <div className="font-medium leading-none text-gray-900 dark:text-white"> Prepaid </div>
              <p id="credit-card-text" className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400">Pay with Razorpay</p>
            </div>
          </div>
        </label>

        <label htmlFor="pay-on-delivery" className="rounded-lg border border-gray-200 bg-gray-50 p-4 ps-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-start">
            <div  className="flex h-5 items-center">
              <input
                id="pay-on-delivery"
                aria-describedby="pay-on-delivery-text"
                type="radio"
                name="payment-method"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={() => setPaymentMethod("COD")}
                className="h-4 w-4 border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
              />
            </div>

            <div className="ms-4 text-sm">
              <p className="font-medium leading-none text-gray-900 dark:text-white"> Payment on delivery </p>
              <p id="pay-on-delivery-text" className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400">+50 Rs payment processing fee</p>
            </div>
          </div>
        </label>
      </div>
        </div>


      { user ?
       paymentMethod === "COD"? <button
        type="submit"
        className={`bg-[#BC264B] hover:bg-pink-700 text-white font-semibold py-3 px-6 rounded-lg w-full ${isLoading ? "opacity-50" : ""}`}
        disabled={isLoading ||!addresses.length || !Items.length}
        onClick={()=>handleCODPayment(selectedAddress)}
      >
        {isLoading ? "Processing..." : "Place Order"}
      </button>:
        <button
        type="submit"
        className={`bg-[#BC264B] hover:bg-pink-700 text-white font-semibold py-3 px-6 rounded-lg w-full ${isLoading ? "opacity-50" : ""}`}
        disabled={isLoading || !addresses.length || !Items.length}
        onClick={()=>onSubmitPrepaid(selectedAddress)}
      >
        {isLoading ? "Processing..." : "Proceed to Payment"}
      </button> :
      paymentMethod === "COD"? <button
      type="submit"
      className={`bg-[#BC264B] hover:bg-pink-700 text-white font-semibold py-3 px-6 rounded-lg w-full ${isLoading ? "opacity-50" : ""}`}
      disabled={isLoading || !Items.length}
      onClick={handleSubmit(handleCODPayment)}
    >
      {isLoading ? "Processing..." : "Place Order"}
    </button>:
      <button
      type="submit"
      className={`bg-[#BC264B] hover:bg-pink-700 text-white font-semibold py-3 px-6 rounded-lg w-full ${isLoading ? "opacity-50" : ""}`}
      disabled={isLoading || !Items.length}
      onClick={handleSubmit(onSubmitPrepaid)}
    >
      {isLoading ? "Processing..." : "Proceed to Payment"}
    </button>
       }
    </form>
    </>
  );
};

export default DeliveryForm;
