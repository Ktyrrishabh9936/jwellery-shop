import FooterHead from "@/components/Footer/footerppagesHeader";
import React from "react";

const ShippingReturns = () => {
  return (
        <>
        <FooterHead title="Shipping Policy"/>
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Shipping Section */}
      
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Shipping</h2>
        <ul  className="space-y-4 text-gray-600">
          <li>
            <strong>Shipping Time:</strong> Orders are usually processed and shipped within 3-4 business days. Please note personalised items will take longer to process. If your order has both personalised and non-personalised items, the order will be split.
          </li>
          <li>
            <strong>Shipping Charges:</strong> We offer free shipping on all orders over Rs. 4999. Please note that we do not offer free shipping on international orders and returns.

          </li>
          <li>
            <strong>Tracking:</strong> You will receive tracking details over WhatsApp, email or SMS, once the order is shipped.
          </li>
          <li>In case you’re ordering other items along with personalised jewellery, your order might arrive in parts.</li>
        </ul>
      </div>

      {/* Returns Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Returns</h2>
        <ul className="space-y-4 text-gray-600">
          <li>
            <strong>Return Policy:</strong> We offer a 15-day return policy for all unused and unworn items, no questions asked. However, please note that the 15-day return does not apply to personalised jewellery, coins, utensils, and God idols other than in cases of defective/spurious products. JENII reserves the right to process refunds after checking the returned items. In case you have purchased a JENII product from anywhere other than the JENII Website or JENII Exclusive Stores, the return policies of your source of purchase shall apply. Any shipping charges (if paid) at the time of placing the order are non refundable in case of returns.
          </li>
          <li>
          In case of missing items in return orders, i.e., where the customer claims to have returned multiple products but actual pickup doesn't include all said items, the company has a right to deduct an amount up to the full MRP of the missing product from the refund amount. This shall extend to promotional products, including but not limited to free gifts and silver coins.
          </li>
          <li>
            <strong>Refund Policy:</strong> In case you have requested the return of any of your products, the refund of the same shall be initiated once we receive the product back in our warehouse.
          </li>
          <li>
            <strong>Replacement & Exchange:</strong> You can also avail replacement or exchange of your order as per your requirements. The conditions remain the same as those applicable to returns. The replacement will only be shipped after the initial return has been picked up or delivered.
          </li>
          <li>
            <strong>Return Process:</strong> You can initiate a return request from our website. Alternatively, you can reach out to our Customer Support team, and they’ll guide you through the process. Once you have booked the return request, we request you to be available for the reverse pick-up, and we request you to answer calls from the delivery partner. In the absence of your availability or inability to answer the calls, the delivery partner may, at their discretion, cancel the reverse pick-up. In all such cases, the process will have to be re-initiated again, and the overall timeline will increase.
          </li>
          <li>
          Further, please note that while most pin codes are forward and reverse serviceable, in rare cases, some pin codes may only be forward serviceable and not reverse serviceable. In all such cases, we may request you to return the product via an alternate courier service, such as India Post and reimburse all reasonable shipping costs incurred by you for processing such returns.
          </li>
          <li>
          In the unlikely event that you receive an empty parcel or a missing product, we would request you to reach out to our customer support team for assistance within 48 hours of the package being delivered. We will be requiring a 360-degree unpacking video of the parcel for us to process the request further. Please note that insufficient evidence or visible signs of tampering with the packet may result in your claim not being honoured. In all such cases, the brand reserves the right to take the final decision.
          </li>
        </ul>
      </div>
    </div>
    </>
  );
};

export default ShippingReturns;
