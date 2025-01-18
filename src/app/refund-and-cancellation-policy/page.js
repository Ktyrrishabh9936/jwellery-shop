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
     <p>Jenii strives to offer high-quality products and customer satisfaction. If you are not satisfied with your purchase, you may be eligible to return the product within one (1) day of delivery for exchange or store credit, provided it is in its original, unused condition with all packaging and documentation intact.
              </p>
                <p>
                        <strong>Exclusions:</strong>Due to the unique nature of sterling silver jewellery, exchanges or returns may not be available for customized pieces. Jenii reserves the right to reject returns that do not meet our conditions.
                </p>
     </div>
    </div>
  </div>
  );
};

export default RefundPolicy;
