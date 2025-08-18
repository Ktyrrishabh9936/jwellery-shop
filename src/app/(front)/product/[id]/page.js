// app/product/[id]/page.tsx
import Product from "@/components/ProductPage/Product";
import Footer from "@/components/HomePage/Footer";
import { getProductById ,getProductMetaById } from "@/lib/api/products"; // assume you have an API
import {load} from "cheerio";
import NotFound from "@/app/not-found";
function getTextFromHTML(html) {
  const $ = load(html);
  return $.text();
}
export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await getProductMetaById(id);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "This product does not exist.",
    };
  }
  const description = getTextFromHTML(product.description);

  return {
    title: product.name,
    description: description,
    openGraph: {
      title: product.name,
      description: description,
      images: [process.env.NEXT_PUBLIC_IMAGE_URL+product.image], // Make sure this is a full URL
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: description,
      images: [process.env.NEXT_PUBLIC_IMAGE_URL+product.image],
    },
  };
}

export default async function Page({ params }) {
  const { id } = await params;
  const data = await getProductById(id);
  if(!data) return <NotFound />
  return (
    <>
      <div className="p-0 md:p-2">
        <Product id={id} product={data.product} relatedProducts={data.relatedProducts} />
      </div>
      <Footer />
    </>
  );
}
