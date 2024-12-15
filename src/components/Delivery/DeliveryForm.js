"use client";
import Script from "next/script";
import axios from "axios";
import {  Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {  useEffect, useState } from "react";
import { Select, Option } from "@/MaterialTailwindNext";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getAddress } from "@/lib/reducers/addressReducer";
import {state_arr,s_a} from "./statescitydata";
import { useSession } from "next-auth/react";
import { clearCart } from "@/lib/reducers/cartReducer";
const DeliveryForm = () => {
  const navigate  = useRouter();
  const dispatch  = useDispatch();
  const [cities, setCities] = useState([]);
  const [selectedAdress, setSelectedAdress] = useState("");

  const handleStateChange = (event) => {
    const state = event.target.value;

    // Get the index of the state to fetch corresponding cities
    const stateIndex = state_arr.indexOf(state) + 1; // +1 to match the city array indexing
    const cityArray = s_a[stateIndex]?.split("|") || [];
    setCities(cityArray);
    setValue("city","")
  };

  const [paymentMethod, setPaymentMethod] = useState("Prepaid");
  const {address} = useSelector((state)=>state.address)
  const {user} = useSelector((state)=>state.user);
  const session = useSession();
  useEffect(() => {
    if(session.status === "authenticated"){
    dispatch(getAddress())
    }
  }, []);
  const [isNewAddress, setNewAddress] = useState(true);
  const validationSchema = Yup.object().shape({
    selectedDetails:Yup.string(),
    firstName:isNewAddress?Yup.string().required("First Name is required"):Yup.string(),
    lastName:isNewAddress?Yup.string().required("Last Name is required"):Yup.string(),
    contact:isNewAddress?Yup.string().required("Contact Number is required").matches(/^[0-9]{10}$/, "Must be a valid 10-digit number"):Yup.string(),
    street:isNewAddress?  Yup.string().required("Address Line 1 is required"):Yup.string(),
    city: isNewAddress? Yup.string().required("City is required"):Yup.string(),
    state:isNewAddress? Yup.string().required("State is required"):Yup.string(),
    postalCode: isNewAddress?Yup.string().required("postalCode is required").matches(/^[0-9]{6}$/, "Must be a valid 6-digit postalCode"):Yup.string(),
    landmark: Yup.string(),
    isSaveAddress: Yup.boolean(),
  });
  const { register, handleSubmit,control,setValue, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const [isLoading, setIsLoading] = useState(false);

  const formatAddress = (address)=>{
    return `${address.firstName} ${address.lastName} , ${address.contact} , ${address.landmark} ${address.street} ${address.city} ${address.state} ${address.postalCode}`;
  }
  const onSubmitPrepaid = async (formdata) => {
    console.log("Prrepaid",formdata)
    try {

      setIsLoading(true);
      
      const {data} = await axios.post("/api/payment/create-order" ,formdata);
      const {address,order,amount} = data;
      console.log(data)
      console.log("Order placed successfully");
      const { key, ...restProps } = {
        key:"rzp_test_sy0ik5pd9JpjmO", // Razorpay Key ID
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
          };

          const result = await axios.post(
            `/api/payment/verify-payment/`,
            orderData
          );

          console.log(result.data);
          navigate.push("/myorders")
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
      console.log("Prrepaid",orderData)
      console.log("COD selected, order will be processed without payment.");
      saveOrder(orderData);
    } catch (error) {
      console.error("COD payment processing failed:", error);
    }
  };


  function handleAddress(id){
    setSelectedAdress(formatAddress(address[id]))
    setValue('selectedDetails',address[id]._id)
    setNewAddress(false);
  }

  

  return (
    <> 
    <Script
    id="razorpay-checkout-js"
    src="https://checkout.razorpay.com/v1/checkout.js"
  />
    <form className="max-w-lg mx-auto p-4 text-black space-y-4">
      {/* Delivery Section */}
      <h2 className="text-xl font-bold mb-4">Delivery</h2>
      <div className="mt-5 bg-white shadow cursor-pointer rounded-xl">
            <div className="flex">
               {/* <div className="flex-1 py-5 pl-5 overflow-hidden">
                  <ul>
                     <li className="text-xs text-gray-600 uppercase ">Rishabh Katiyar</li>
                     <li>6304832742</li>
                     <li>Gaya prasad nagar , bilhaur kanpur nagar </li>
                     <li>kanpur,Uttar Pradesh -202902</li>
                  </ul>
               </div> */}
               {/* <div className="flex-1 py-5 pl-1 overflow-hidden">
                  <ul>
                     <li className="text-xs text-gray-600 uppercase">Sender</li>
                     <li>Rick Astley</li>
                     <li>Rickrolled 11</li>
                     <li>1000 Vienna</li>
                  </ul>
               </div> */}
               {/* <div className="flex-none pt-2.5 pr-2.5 pl-1">
                  <button type="button" className="px-2 py-2 font-medium tracking-wide text-black capitalize transition duration-300 ease-in-out transform rounded-xl hover:bg-gray-300 focus:outline-none active:scale-95">
                     <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
                        <path d="M0 0h24v24H0V0z" fill="none"></path>
                        <path d="M5 18.08V19h.92l9.06-9.06-.92-.92z" opacity=".3"></path>
                        <path d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29s-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83zM3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM5.92 19H5v-.92l9.06-9.06.92.92L5.92 19z"></path>
                     </svg>
                  </button>
               </div> */}
         
            </div>
         </div>

      {/* <button type="button" className="relative w-full flex justify-center items-center px-5 py-2.5 font-medium tracking-wide text-white capitalize   bg-black rounded-md hover:bg-gray-900  focus:outline-none   transition duration-300 transform active:scale-95 ease-in-out">
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

         <div className="flex flex-row-reverse p-3">
               <div className="flex-initial pl-3">
                  <button type="button" className="flex items-center px-5 py-2.5 font-medium tracking-wide text-white capitalize   bg-black rounded-md hover:bg-gray-800  focus:outline-none focus:bg-gray-900  transition duration-300 transform active:scale-95 ease-in-out">
                     <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF">
                        <path d="M0 0h24v24H0V0z" fill="none"></path>2468
                        <path d="M5 5v14h14V7.83L16.17 5H5zm7 13c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-8H6V6h9v4z" opacity=".3"></path>
                        <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm2 16H5V5h11.17L19 7.83V19zm-7-7c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM6 6h9v4H6z"></path>
                     </svg>
                     <span className="pl-2 mx-1">Save</span>
                  </button>
               </div>
               <div className="flex-initial">
                  <button type="button" className="flex items-center px-5 py-2.5 font-medium tracking-wide text-black capitalize rounded-md  hover:bg-red-200 hover:fill-current hover:text-red-600  focus:outline-none  transition duration-300 transform active:scale-95 ease-in-out">
                     <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px">
                        <path d="M0 0h24v24H0V0z" fill="none"></path>
                        <path d="M8 9h8v10H8z" opacity=".3"></path>
                        <path d="M15.5 4l-1-1h-5l-1 1H5v2h14V4zM6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9z"></path>
                     </svg>
                     <span className="pl-2 mx-1">Delete</span>
                  </button>
               </div>
            </div> */}
            
  {address.length ?   <div>

        
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
        </div>:""}
        
        <div style={{display:isNewAddress?'block':'none'}}>
      <div className="">
      <div className="mb-1">Name</div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div >
        <input
          {...register("firstName")}
          type="text"
          placeholder="First Name"
          className={`border bg-[#F2F2F2] text-black rounded-lg p-3 w-full ${errors.firstName ? "border-red-500" : "border-gray-100"}`}
        />
      {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}

        </div>
        <div>
        <input
          {...register("lastName")}
          type="text"
          placeholder="Last Name"
          className={`border bg-[#F2F2F2] text-black rounded-lg p-3 w-full ${errors.lastName ? "border-red-500" : "border-gray-100"}`}
        />
      {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}

        </div>
        </div>
      </div>

      <div>
      <div className="mb-1">Number</div>

    <div className="flex">
    <button id="states-button" data-dropdown-toggle="dropdown-states" className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-500 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600" type="button">
  <svg aria-hidden="true" className="h-3 me-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 18" fill="none">
    <rect width="24" height="6" fill="#FF9933"/>
    <rect y="6" width="24" height="6" fill="#FFFFFF"/>
    <rect y="12" width="24" height="6" fill="#138808"/>
    <circle cx="12" cy="9" r="2" fill="#000080"/>
    <circle cx="12" cy="9" r="1.5" fill="white"/>
  </svg>
  +91 
</button>
      <input
        {...register("contact")}
        type="tel"
        placeholder="324-456-2323"
        pattern="[0-9]*"
        inputmode="numeric"
        maxlength="10"
        className={`border bg-[#F2F2F2] text-black rounded-e-lg p-3 w-full md:w-1/2 ${errors.contact ? "border-red-500" : "border-gray-100"}`}
      />
      </div>
      {errors.contact && <p className="text-red-500 text-sm">{errors.contact.message}</p>}
      </div>

      <div className="mt-3">
      <p className="mb-1">Address</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className=" col-span-2">
        <input
          {...register("street")}
          type="text"
          placeholder="Address Line 1, Flat No, Building Name"
          className={`border bg-[#F2F2F2] text-black rounded-lg p-3 w-full ${errors.street ? "border-red-500" : "border-gray-100"}`}
        />
      {errors.street && <p className="text-red-500 text-sm">{errors.street.message}</p>}

        </div>
        <div className="col-span-2">
        <div className="  flex">
        {/* <input
          {...register("state")}
          type="text"
          placeholder="State"
          className="border bg-[#F2F2F2] text-gray-700 rounded-lg p-3 w-full"
        /> */}
        <button id="states-button" data-dropdown-toggle="dropdown-states" className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-500 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600" type="button">
  <svg aria-hidden="true" className="h-3 me-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 18" fill="none">
    <rect width="24" height="6" fill="#FF9933"/>
    <rect y="6" width="24" height="6" fill="#FFFFFF"/>
    <rect y="12" width="24" height="6" fill="#138808"/>
    <circle cx="12" cy="9" r="2" fill="#000080"/>
    <circle cx="12" cy="9" r="1.5" fill="white"/>
  </svg>
  India 
</button>
          <select
          id="state"
          {...register("state")}
          onChange={handleStateChange}
          className="border bg-[#F2F2F2]  text-black rounded-e-lg p-3 w-full"
        >
          <option value="">Select State</option>
          {state_arr.map((state, index) => (
            <option key={index} value={state}>
              {state}
            </option>
          ))}
        </select>
        </div>
      {errors.state && <p className="text-red-500 text-sm">{errors.state.message}</p>}
      </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
        <input
          {...register("landmark")}
          type="text"
          placeholder="Road, Area, Landmark"
          className={`border bg-[#F2F2F2] text-black rounded-lg p-3 w-full ${errors.landmark ? "border-red-500" : "border-gray-100"}`}
        />
      {errors.landmark && <p className="text-red-500 text-sm">{errors.landmark.message}</p>}
        </div>
        <div>

        <select
          id="city"
          {...register("city")}
          disabled={!cities.length}
          className={`border bg-[#F2F2F2] text-black rounded-lg p-3 w-full ${errors.city ? "border-red-500" : "border-gray-100"} ${
            !cities.length ? "bg-gray-100 cursor-not-allowed" : ""
          }`}
        >
          <option value="">Select City</option>
          {cities.map((city, index) => (
            <option key={index} value={city}>
              {city}
            </option>
          ))}
        </select>
      {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
      </div>
      </div>


<div>
      <p className="mb-1">Pincode</p>
      <div >
        
      <input
        {...register("postalCode")}
        type="text"
        pattern="[0-9]*"
        inputmode="numeric"
        maxlength="10"
        placeholder="Ex - 202302"
        className={`border bg-[#F2F2F2] text-black rounded-lg p-3 w-full md:w-1/2 ${errors.postalCode ? "border-red-500" : "border-gray-100"}`}
      />
      <p class="flex items-center mt-2 text-xs text-slate-500">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      class="w-5 h-5 mr-2"
    >
      <path
        fill-rule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
        clip-rule="evenodd"
      ></path>
    </svg>
    This code helps us to provide location-specific services.
    </p>
    </div>
      {errors.postalCode && <p className="text-red-500 text-sm">{errors.postalCode.message}</p>}
      </div>
      </div>
      <div className="my-3">
        <label className="flex items-center space-x-2">
          <input {...register("isSaveAddress")}  type="checkbox" id="save" className="form-checkbox h-4 w-4 text-pink-600" />
          <label className="text-gray-700" htmlFor="save">Save Address for next time</label>
        </label>
      </div>

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


      <button
        type="submit"
        className={`bg-[#BC264B] hover:bg-pink-700 text-white font-semibold py-3 px-6 rounded-lg w-full ${isLoading ? "opacity-50" : ""}`}
        disabled={isLoading}
        onClick={handleSubmit(onSubmitPrepaid)}
      >
        {isLoading ? "Processing..." : "Proceed to Payment"}
      </button> 
    </form>
    </>
  );
};

export default DeliveryForm;
