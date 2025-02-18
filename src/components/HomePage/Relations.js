import Link from "next/link";

export default function GiftingGuide() {
        const categories = [
          { name: "Mother", image: "/mother.webp", link: "/collections/for-mother" },
          { name: "Brother", image: "/brother.webp", link: "/collections/for-brother" },
          { name: "Sister", image: "/sister.webp", link: "/collections/for-sister" },
          { name: "Husband", image: "/husband.webp", link: "/collections/for-husband" },
          { name: "Wife", image: "/wife.webp", link: "/collections/for-wife" },
          { name: "Friends", image: "/friends.webp", link: "/collections/for-friends" },
        ];
      
        return (
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-6">Gifting Guide</h2>
            <div className="grid grid-cols-3 lg:grid-cols-6 max-w-7xl mx-auto gap-y-6">
              {categories.map((category, index) => (
                <Link key={index} href={category.link} className="group flex flex-col items-center">
                  <div className="relative w-40   overflow-hidden transition-transform group-hover:scale-105">
                    <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
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
      