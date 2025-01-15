import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
const categories = [
        { id: 1, name: "Women", imageUrl: "/images/her.png",link:"/shop-for/women" },
        { id: 2, name: "Men", imageUrl: "/images/him.png",link:"/shop-for/men"},
      ];
export default function MenWomenSection() {
  return (
    <div>
        <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-center">Shop by Category</h2>
              <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-5xl mx-auto">
                {categories.map((category) => (
                  
                  <div
                    key={category.id}
                    className="relative bg-white rounded-lg overflow-hidden mx-auto  min-w-40  w-[90%] sm:w-1/2 "
                  ><Link href={category.link}>
                    <Image
                      width={600}
                      height={400}
                      src={category.imageUrl}
                      alt={category.name}
                      className="object-cover w-full h-full "
                    />
                    {/* <div className="absolute bottom-0 w-full text-center bg-black bg-opacity-50 p-2 text-white">
                      {category.name}
                    </div> */}
                  </Link>
                  </div>
                ))}
              </div>
            </section>
    </div>
  )
}
