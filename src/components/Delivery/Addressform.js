import React, { useState } from 'react'
import {state_arr,s_a} from "./statescitydata";
export default function Addressform({register,errors,setValue,initaiCity=[]}) {
        const [cities, setCities] = useState(initaiCity);
        const handleStateChange = (event) => {
                const state = event.target.value;
            
                // Get the index of the state to fetch corresponding cities
                const stateIndex = state_arr.indexOf(state) + 1; // +1 to match the city array indexing
                const cityArray = s_a[stateIndex]?.split("|") || [];
                setCities(cityArray);
                setValue("city","")
              };
  return (
        <div >
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
          inputMode="numeric"
          maxLength="10"
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
          inputMode="numeric"
          maxLength="10"
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
          fillRule="evenodd"
          d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
          clipRule="evenodd"
        ></path>
      </svg>
      This code helps us to provide location-specific services.
      </p>
      </div>
        {errors.postalCode && <p className="text-red-500 text-sm">{errors.postalCode.message}</p>}
        </div>
        </div>
       
  
        </div>
  )
}
