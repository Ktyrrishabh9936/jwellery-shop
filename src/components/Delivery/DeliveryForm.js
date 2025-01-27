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
import { clearCart } from "@/lib/reducers/cartReducer";
import AddressList from "./adddressList";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import Addressform from "./Addressform";
import { AddressSchema } from "./addressSchema";

const DeliveryForm = () => {
  const navigate  = useRouter();
  const dispatch  = useDispatch();
  const {Items} = useSelector((state)=>state.cart);
  
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("Prepaid");
  const { addresses, loading, error } = useSelector((state) => state.address);
  const {user} = useSelector((state)=>state.user);
  const session = useSession();

  useEffect(() => {
    if(session.status === "authenticated" && addresses.length === 0){
    dispatch(fetchAddresses())
    }
  }, []);

  useEffect(() => {
    if(addresses.length){
    setSelectedAddress(addresses[0])
    }
  }, [addresses]);
  
  const { register, handleSubmit,control,setValue, formState: { errors } } = useForm({
    resolver: yupResolver(AddressSchema),
  });

  const [isLoading, setIsLoading] = useState(false);

 


  
 

  const handleAddAddress = (address) => {
      dispatch(addAddress(address));
    setIsModalOpen(false);
  };


  const handleCreateNewAddress = () => {
    setSelectedAddress(null);
    setIsModalOpen(true);
  };
  const onSubmitPrepaid = async (formdata) => {
    console.log("Prrepaid",formdata)
    try {

      setIsLoading(true);
      
      const {data} = await axios.post("/api/payment/create-order" ,formdata);
      const {address,order,amount} = data;
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
            address,
            Items
          };

          const result = await axios.post(
            `/api/payment/verify-payment/`,
            orderData
          );

          console.log(result.data);
          navigate.push("/")
          dispatch(clearCart())
        },
        prefill: {
          name: address.name,
          email: user.email, // Optional
          contact: address.contact,
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
      console.error("Error in submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleCODPayment = async (orderData) => {
    try {
      // Process the order without payment
      setIsLoading(true);
      console.log("COD",orderData)
      console.log("COD selected, order will be processed without payment.");
      const {data} = await axios.post("/api/payment/cod-order" ,orderData);
      console.log(data);
      setIsLoading(false);
      dispatch(clearCart());
      navigate.push("/")
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
    <form className="max-w-lg mx-auto p-4 text-black space-y-4">
      {/* Delivery Section */}
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

<div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <AddressList addresses={addresses} selectedAddress={selectedAddress} setSelectedAddress={setSelectedAddress} />
      <button type="button" className="relative w-full flex justify-center items-center px-5 py-2.5 font-medium tracking-wide text-white capitalize bg-black rounded-md hover:bg-gray-900 focus:outline-none transition duration-300 transform active:scale-95 ease-in-out mt-3" onClick={handleCreateNewAddress}>
        <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF">
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

      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black opacity-30" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md bg-white rounded-lg p-6">
            <DialogTitle className="text-lg font-medium text-gray-900">Add New Address</DialogTitle>
           <Addressform register={register} errors={errors} setValue={setValue}/>
         <div className="flex flex-row-reverse p-3">
               <div className="flex-initial pl-3">
                  <button type="button" onClick={(handleSubmit(handleAddAddress))} className="flex items-center px-5 py-2.5 font-medium tracking-wide text-white capitalize   bg-black rounded-md hover:bg-gray-800  focus:outline-none focus:bg-gray-900  transition duration-300 transform active:scale-95 ease-in-out">
                     <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF">
                        <path d="M0 0h24v24H0V0z" fill="none"></path>2468
                        <path d="M5 5v14h14V7.83L16.17 5H5zm7 13c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-8H6V6h9v4z" opacity=".3"></path>
                        <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm2 16H5V5h11.17L19 7.83V19zm-7-7c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM6 6h9v4H6z"></path>
                     </svg>
                     <span className="pl-2 mx-1">Save</span>
                  </button>
               </div>
               <div className="flex-initial">
                  <button type="button" className="flex items-center px-5 py-2.5 font-medium tracking-wide text-black capitalize rounded-md  hover:bg-red-200 hover:fill-current hover:text-red-600  focus:outline-none  transition duration-300 transform active:scale-95 ease-in-out" onClick={() => setIsModalOpen(false)}>
             
                     <span className="pl-2 mx-1">Cancel</span>
                  </button>
               </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
        
       

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


      {
       paymentMethod === "COD"? <button
        type="submit"
        className={`bg-[#BC264B] hover:bg-pink-700 text-white font-semibold py-3 px-6 rounded-lg w-full ${isLoading ? "opacity-50" : ""}`}
        disabled={isLoading ||!addresses.length || !Items.length}
        onClick={()=>handleCODPayment({addressId:selectedAddress?._id,Items:Items})}
      >
        {isLoading ? "Processing..." : "Place Order"}
      </button>:
        <button
        type="submit"
        className={`bg-[#BC264B] hover:bg-pink-700 text-white font-semibold py-3 px-6 rounded-lg w-full ${isLoading ? "opacity-50" : ""}`}
        disabled={isLoading || !addresses.length || !Items.length}
        onClick={()=>onSubmitPrepaid({addressId:selectedAddress?._id,Items:Items})}
      >
        {isLoading ? "Processing..." : "Proceed to Payment"}
      </button>
       }
    </form>
    </>
  );
};

export default DeliveryForm;
