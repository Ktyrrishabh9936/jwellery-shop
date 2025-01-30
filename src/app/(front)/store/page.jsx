"use client"
import Image from "next/image";
import Link from "next/link";

import { useState } from "react";

const JeniiDescription = () => {
  const [showMore, setShowMore] = useState(false);

  const shortDescription = `
    JP Sterling Silver is a prominent brand located in Vadodara, India, known for its exquisite collection of sterling silver jewelry and products. 
    With two physical stores in Vadodara—one in Vasna Bhayli and the other in Karelibaug—and an online store at jenii.in, the brand offers a variety of sterling silver items, including jewelry, idols, and more.
  `;

  return (
    <div className="p-6 max-w-4xl ">
      <h1 className="text-2xl font-bold mb-4">Jenii - JP Sterling Silver</h1>
      <p className="text-gray-700">
        {showMore ? 
        (
                <div className=" space-y-3">
                <p>JP Sterling Silver is a prominent brand located in Vadodara, India, known for its exquisite collection of sterling silver jewelry and products. With two physical stores situated in the vibrant city of Vadodara—one in Vasna Bhayli and the other in Karelibaug—JP Sterling Silver has established a strong local presence. These locations allow customers to experience the beauty and quality of their offerings firsthand.</p>

                <p>The brand specializes in a wide range of sterling silver items, including intricately designed jewelry pieces such as rings, necklaces, bracelets, and earrings. Each piece is crafted with attention to detail, ensuring that customers receive not only beautiful but also durable products. In addition to jewelry, JP Sterling Silver also offers silver idols, which are often sought after for religious and decorative purposes. These idols are crafted with precision and care, making them ideal for both personal use and gifting.</p>
                <p>Beyond jewelry and idols, JP Sterling Silver provides a variety of other silver products that cater to different tastes and preferences. Whether you are looking for elegant accessories to complement your outfit or unique items to enhance your home decor, the brand has something to offer for everyone.
</p>
                <p>Recognizing the evolving shopping landscape, JP Sterling Silver has expanded its reach by launching an online store at jenii.in. This move allows customers to browse and purchase their favorite silver products from the comfort of their homes. The online platform showcases the brand's extensive collection, making it easier for shoppers to find exactly what they need.</p>
                <p>To enhance the shopping experience, JP Sterling Silver frequently offers attractive deals and discounts on their online platform. These promotions make it more accessible for customers to indulge in high-quality sterling silver items without breaking the bank. Whether you are a long-time fan of the brand or a first-time visitor to their online store, there are plenty of opportunities to find great value in their offerings.</p>
                <p>JP Sterling Silver is a well-established brand in Vadodara that caters to a diverse clientele with its stunning range of sterling silver jewelry and products. With two conveniently located offline stores and a user-friendly online shopping experience at jenii.in, customers can easily explore and purchase their favorite silver items. The combination of quality craftsmanship, unique designs, and regular discounts makes JP Sterling Silver a go-to destination for anyone seeking beautiful sterling silver pieces.</p>
                </div>
        )
         : shortDescription}
      </p>
      <button
        onClick={() => setShowMore(!showMore)}
        className="mt-4 text-pink-600 hover:underline focus:outline-none"
      >
        {showMore ? "Show Less" : "Show More"}
      </button>
    </div>
  );
};


const ProductDescription = () => {
  const product = {
    inspiration:
      "This necklace can be a great way of telling your sweetheart that you love her to infinity and beyond. It sure will be a special gift.",
    design:
      "This rose gold pendant with a link chain features a heart motif studded with zircons and an infinity motif interconnected.",
    material: "925 Silver with Rose Gold Plating ......",
  };

  return (
        <div className="max-w-6xl mx-auto mb-10">
        <JeniiDescription/>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 ">
      {/* Card 1 */}
      <Link href="https://maps.app.goo.gl/GZ8TsMN4NF8Mko6S8">

      <div className="flex flex-col items-center border p-4 shadow-md rounded-lg group">
        <div className="w-full h-80  bg-gray-300 rounded-md mb-4">
                <Image
                src="/jp-sterling.jpg"
                alt="Necklace"
               height={100}
               width={200}
                className="rounded-md w-full h-full"
                />
        </div>
        <div>
          <h3 className="text-lg font-bold mb-2  group-hover:underline">Vasna Bhayli,
Broadway Empire, Nilamber Circle, Near Akshar
Pavilion, Vasna Bhayli Main Road, Vadodara, Gujarat,
391410</h3>
          {/* <div className="mb-2">
            <h4 className="font-semibold">The Inspiration:</h4>
            <p className="text-gray-700">{product.inspiration}</p>
          </div>
          <div>
            <h4 className="font-semibold">The Design:</h4>
            <p className="text-gray-700">{product.design}</p>
            <ul className="list-disc pl-6">
              <li className="text-gray-700">{product.material}</li>
            </ul>
          </div> */}
        </div>
        {/* <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3691.3813536938214!2d73.13856281098492!3d22.30141274277011!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395fc97a52df2dff%3A0x8a31a8ec9fed0ebb!2sJenii%20(%20J.P%20Sterling%20Silver%20)!5e0!3m2!1sen!2sin!4v1738213854914!5m2!1sen!2sin" width="600" height="450" style={{border:0}} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe> */}
      </div>
      </Link>
       

      {/* Card 2 */}
      <Link href="https://maps.app.goo.gl/wUGnfqDFHjsByPno7">
      <div className="flex flex-col items-center border p-4 shadow-md rounded-lg group">
        <div className="w-full h-80  bg-gray-300 rounded-md mb-4">
        <Image
                src="/jp-sterling-2.jpg"
                alt="Necklace"
               height={100}
               width={200}
                className="rounded-md w-full h-full"
                />
        </div>
        <div>
          <h3 className="text-lg font-bold mb-2 group-hover:underline">Karelibaug,
Kalakunj, opposite Avakar Hall, Near Water,
Karelibaug, Vadodara, Gujarat, 390018</h3>
          {/* <div className="mb-2">
            <h4 className="font-semibold">The Inspiration:</h4>
            <p className="text-gray-700">{product.inspiration}</p>
          </div>
          <div>
            <h4 className="font-semibold">The Design:</h4>
            <p className="text-gray-700">{product.design}</p>
            <ul className="list-disc pl-6">
              <li className="text-gray-700">{product.material}</li>
            </ul>
          </div> */}
        </div>
      </div>
      </Link>
 
    </div>
    <iframe src="https://www.google.com/maps/d/embed?mid=1V8BsLIrMCSx2SfxH7Qmtj1l2OdUtCeY&ehbc=2E312F&noprof=1" width="640" height="480" className=" w-full  max-w-6xl mx-auto"></iframe>

    </div>
  );
};

export default ProductDescription;
