// app/product/[id]/page.tsx
import Product from "@/components/ProductPage/Product";
import Footer from "@/components/HomePage/Footer";
import { getProductById } from "@/lib/api/products"; // assume you have an API


export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "This product does not exist.",
    };
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [process.env.NEXT_PUBLIC_IMAGE_URL+product.image], // Make sure this is a full URL
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description,
      images: [process.env.NEXT_PUBLIC_IMAGE_URL+product.image],
    },
  };
}

export default async function Page({ params }) {
  const { id } = await params;
  return (
    <>
      <div className="p-0 md:p-2">
        <Product id={id} />
      </div>
      <Footer />
    </>
  );
}
