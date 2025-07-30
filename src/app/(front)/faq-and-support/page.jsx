import FooterHead from "@/components/Footer/footerppagesHeader";
import React from "react";

const SupportPage = () => {
  return (
        <>
        <FooterHead title="FAQ and Support"/>
        <div className="bg-white relative -top-16  rounded-3xl md:rounded-[4rem]  text-black pt-10 flex flex-col justify-center items-center space-y-12">
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Welcome Message */}
      <section>
        <h1 className="text-3xl font-bold text-gray-800">Need Help? We're Here for You</h1>
        <p className="text-gray-600 mt-2">
          We're committed to providing exceptional customer service. If you have any questions or concerns, please don't hesitate to reach out to us.
        </p>
      </section>

      {/* Contact Information */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800">Contact Information</h2>
        <p className="text-gray-600 mt-2">Need help? Contact our support team.</p>
      </section>

      {/* FAQs */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800">FAQs</h2>
        <div className="space-y-6 mt-4">
          {/* General Questions */}
          <h3 className="text-xl font-semibold text-gray-700">General Questions</h3>
          <details open className="bg-gray-100 rounded-lg p-4">
            <summary className="font-medium text-gray-800 cursor-pointer">
              What is sterling silver?
            </summary>
            <p className="mt-2 text-gray-600">
              Sterling silver is a high-quality alloy consisting of 92.5% pure silver and 7.5% other metals, typically copper. This alloy enhances the durability and strength of the silver.
            </p>
          </details>
          <details open className="bg-gray-100 rounded-lg p-4">
            <summary className="font-medium text-gray-800 cursor-pointer">
              Is JENII jewelry hypoallergenic?
            </summary>
            <p className="mt-2 text-gray-600">
              Yes, our sterling silver jewelry is hypoallergenic and suitable for most skin types.
            </p>
          </details>
          <details open className="bg-gray-100 rounded-lg p-4">
            <summary className="font-medium text-gray-800 cursor-pointer">
              Is JENII jewelry tarnish-resistant?
            </summary>
            <p className="mt-2 text-gray-600">
              While sterling silver is naturally tarnish-resistant, it may tarnish over time, especially when exposed to air, moisture, and certain chemicals. Regular cleaning and proper storage can help minimize tarnish.
            </p>
          </details>
          <details open className="bg-gray-100 rounded-lg p-4">
            <summary className="font-medium text-gray-800 cursor-pointer">
              How do I place an order on the JENII website?
            </summary>
            <p className="mt-2 text-gray-600">
              To place an order, simply browse our collection, select your desired items, and add them to your cart. Proceed to checkout and follow the instructions to complete your purchase.
            </p>
          </details>
          <details open className="bg-gray-100 rounded-lg p-4">
            <summary className="font-medium text-gray-800 cursor-pointer">
              What are your shipping options?
            </summary>
            <p className="mt-2 text-gray-600">
              We offer standard shipping. Shipping costs and delivery times may vary depending on your location.
            </p>
          </details>
          <details open className="bg-gray-100 rounded-lg p-4">
            <summary className="font-medium text-gray-800 cursor-pointer">
              Do you ship internationally?
            </summary>
            <p className="mt-2 text-gray-600">
              Yes, we ship internationally to many countries. Please check our shipping policy for more details on international shipping rates and restrictions.
            </p>
          </details>
          <details open className="bg-gray-100 rounded-lg p-4">
            <summary className="font-medium text-gray-800 cursor-pointer">
              What is your return policy?
            </summary>
            <p className="mt-2 text-gray-600">
              We offer a hassle-free return policy. If you're not satisfied with your purchase, you can return it within 48 hours for a full refund or exchange. Please refer to our return policy for specific terms and conditions.
            </p>
          </details>
        </div>
      </section>

      {/* Return and Exchange Policy */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800">Return and Exchange Policy</h2>
        <p className="text-gray-600 mt-2">
          Understand our terms of service by reviewing our detailed return and exchange policy.
        </p>
      </section>

     

     
    </div>
    </div>
    </>
  );
};

export default SupportPage;
