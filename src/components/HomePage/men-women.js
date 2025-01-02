import Image from 'next/image';
import React from 'react'
const categories = [
        { id: 1, name: "Women", imageUrl: "/images/women-category.png" },
        { id: 2, name: "Men", imageUrl: "/images/men-category.png" },
      ];
export default function MenWomenSection() {
  return (
    <div>
        <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-center">Shop by Category</h2>
              <div className="flex justify-center gap-4 max-w-5xl mx-auto">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="relative bg-white rounded-lg overflow-hidden  min-w-40 w-1/2 "
                  >
                    <Image
                      width={133}
                      height={150}
                      src={category.imageUrl}
                      alt={category.name}
                      className="object-cover w-full h-full"
                    />
                    {/* <div className="absolute bottom-0 w-full text-center bg-black bg-opacity-50 p-2 text-white">
                      {category.name}
                    </div> */}
                  </div>
                ))}
              </div>
            </section>
    </div>
  )
}
