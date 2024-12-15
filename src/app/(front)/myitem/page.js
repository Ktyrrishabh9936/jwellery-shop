'use client'
import { useState } from 'react';
import Image from 'next/image';
import NavBar from '@/components/HomePage/Navbar';
import Footer from '@/components/HomePage/Footer';

export default function Page() {
  const steps = [
    { stat: "Order Received", date: "21st November, 2019" },
    { stat: "Order Processed", date: "21st November, 2019" },
    { stat: "Order Shipped", date: "21st November, 2019" },
    { stat: "Order Dispatched", date: "21st November, 2019" },
    { stat: "Order Delivered", date: "21st November, 2019" },
  ];

  const [currentStep, setCurrentStep] = useState(0);

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

  return (
    <>
    <NavBar/>
    <section className="p-9 rounded-lg shadow-xl bg-white max-w-md mx-auto ">
      <figure className="flex items-center">
        <img
          src="https://photos.melorra.com/fit-in/1024x1024/dev/catalogue/images/ET/OPT/580/C16PET09F_P_580.jpg"
          alt="Jewellery Image"
          width={80}
          height={80}
          className="rounded-full border border-[#f05a00] mr-6"
        />
        <figcaption className="flex flex-col justify-evenly">
          <h4 className="text-xl font-semibold">Some Jewellery Name</h4>
          <h6 className="text-sm font-light">Category</h6>
          <h2 className="text-lg font-semibold text-[#f05a00]">₹ 23,456</h2>
        </figcaption>
      </figure>

      <div className="order-track mt-8 pt-6 border-t border-dashed border-[#2c3e50]">
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
      </div>

      <div className="flex justify-between mt-6">
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
      </div>
    </section>
    <Footer/>
    </>
  );
}
