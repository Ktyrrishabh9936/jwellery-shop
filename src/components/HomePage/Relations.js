import Image from "next/image";
import Link from "next/link";
export default function GiftingGuide() {
        const categories = [
          { name: "Mother", image: "https://www.giva.co/cdn/shop/files/MOTHER-min_48be248f-4d31-4c60-9344-9bfc1318f0cf.jpg?v=1740308659&width=300", link: "/collections/for-mother" },
          { name: "Brother", image: "https://www.giva.co/cdn/shop/files/brother-min_e0a2b9a6-450c-4b40-95e1-e19d52c87dc9.jpg?v=1740308658&width=300", link: "/collections/for-brother" },
          { name: "Sister", image: "https://www.giva.co/cdn/shop/files/SISTER-min_ba1e6a0b-d8e2-40ad-bca4-db8a5a1be51e.jpg?v=1740308658&width=300", link: "/collections/for-sister" },
          { name: "Wife", image: "https://www.giva.co/cdn/shop/files/wife-min_c95d9c52-f0da-4bc1-ac8c-e693012c14fb.jpg?v=1740308658&width=300", link: "/collections/for-wife" },

        ];
      
        return (
          <div className="text-center max-w-3xl lg:max-w-7xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">Gifting Guide</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 mx-auto ">
              {categories.map((category, index) => (
                <Link key={index} href={category.link} className="group flex flex-col items-center">
                  <div className="relative w-40   overflow-hidden transition-transform group-hover:scale-105">
                    <Image  src={category.image} alt={category.name} height={70} width={50} className="w-full h-full object-cover" />
                  </div>
                  {/* <span className="mt-2 px-4 py-2 bg-red-500 text-white text-lg font-medium rounded-b-lg">
                    {category.name}
                  </span> */}
                </Link>
              ))}
            </div>
          </div>
        );
      }
      