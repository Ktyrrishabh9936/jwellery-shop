import { Sparkles, HandHeart, ShieldCheck, HeartHandshake, BadgeCheck } from "lucide-react";

export default function JewelleryFeatures() {
  const features = [
    {
      icon: <Sparkles className="w-10 h-10 text-white" />,
      title: "Modern Jewellery, Indian Soul",
    },
    {
      icon: <HandHeart className="w-10 h-10 text-white" />,
      title: "Handcrafted by Local Artisans",
    },
    {
      icon: <ShieldCheck className="w-10 h-10 text-white" />,
      title: "Safe for All Skin Types",
    },
    {
      icon: <HeartHandshake className="w-10 h-10 text-white" />,
      title: "Quality You Can Trust",
    },
    {
      icon: <BadgeCheck className="w-10 h-10 text-white" />,
      title: "Certified 925 Hallmarked Silver",
    },
  ];

  return (
    <section className="bg-[#c41e55] py-10">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-white mb-12 font-h1">Why You’ll Love Jenii</h1>
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 text-center text-white">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="mb-3">{feature.icon}</div>
            <h3 className="text-base font-parah">{feature.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}
