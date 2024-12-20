export default function calculatedDiscount(price, discountedPrice) {
  const discount = ((price - discountedPrice) / price) * 100;
  return Math.ceil(discount);
}

export const formatPrice = (price) => {
  return price ? `Rs.${parseFloat(price).toFixed(2)}` : "N/A";
};