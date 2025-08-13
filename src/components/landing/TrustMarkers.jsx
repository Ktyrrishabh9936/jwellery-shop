import { Truck, Shield, Package, HeadphonesIcon } from "lucide-react";

const trustFeatures = [
  {
    icon: Truck,
    title: "Cash on Delivery Available",
    description:
      "Shop stress-free and pay at your convenience with our easy Cash on Delivery option.",
  },
  {
    icon: Shield,
    title: "Quality Assurance",
    description:
      "Each piece passes through strict quality checks to ensure it arrives flawless and ready to shine.",
  },
  {
    icon: Package,
    title: "Premium & Secure Packaging",
    description:
      "Your jewellery is carefully packed in secure, damage-proof boxes for a delightful unboxing experience.",
  },
  {
    icon: HeadphonesIcon,
    title: "Support That Truly Cares",
    description:
      "Need help? Jenii's team is here to guide you with quick, friendly, and reliable support whenever you need it.",
  },
];

export default function TrustMakers() {
  return (
    <section className="bg-white py-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
        {trustFeatures.map((feature, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <feature.icon className="w-10 h-10 text-black mb-4" />
            <h3 className="text-lg font-h2 ">{feature.title}</h3>
            <p className="text-sm text-gray-600 mt-1 max-w-xs font-parah">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
