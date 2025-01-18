// pages/refund-policy.js
import FooterHead from '@/components/Footer/footerppagesHeader';
import React from 'react';

const RefundPolicy = () => {
  return (
    <div className="bg-gray-50 min-h-screen p-6 md:p-10 lg:p-16">
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
      <div className="mb-8">
    <h1 className="text-3xl font-bold text-gray-800">Refund and Cancellation Policy</h1>
    <div className="h-1 w-16 bg-blue-500 mt-2"></div>
  </div>
     <div className='text-gray-700 space-y-4'>
     <h2 className="text-xl font-bold mt-6">1. Cancellation by Customer</h2>
                <p>
                  Customers may cancel an order before it ships. Registered customers can check their
                  order status by contacting us via email or phone. Once a cancellation request is
                  confirmed, the refund process will be initiated using the original payment method.
                </p>

                <h2 className="text-xl font-bold mt-6">2 Returns and Refund Policy</h2>
                <p>Jenii strives to offer high-quality products and customer satisfaction. If you are not satisfied with your purchase, you may be eligible to return the product within one (1) day of delivery for exchange or store credit, provided it is in its original, unused condition with all packaging and documentation intact.
                Exclusions: Due to the unique nature of sterling silver jewellery, exchanges or returns may not be available for customized pieces. Jenii reserves the right to reject returns that do not meet our conditions.</p>
                <p>
                        <strong>Exclusions:</strong>Due to the unique nature of sterling silver jewellery, exchanges or returns may not be available for customized pieces. Jenii reserves the right to reject returns that do not meet our conditions.
                </p>

                <h2 className="text-xl font-bold mt-6">3 Exchange Policy</h2>
          <p>
            Jenii offers exchange options for certain items in their original, unused condition.
            Exchange eligibility and conditions include:
          </p>
          <ul  className="list-disc ml-5 mt-2">
            <li>The item must be inspected for authenticity and wear.</li>
            <li>An original receipt or authenticity certificate must be provided.</li>
            <li>
              Jenii may refuse exchanges if the item has been altered, damaged, or missing essential
              documentation.
            </li>
          </ul>
     </div>
    </div>
  </div>
  );
};

export default RefundPolicy;
