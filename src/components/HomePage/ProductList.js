// ProductList.js
import Image from "next/image";
import { Button } from "@material-tailwind/react";
import { toast } from "react-toastify";
import { useState } from "react";
import axios from "axios";
import { getServerCookie } from "@/utils/serverCookie";
import { useRouter } from "next/navigation";

export default function ProductList({ products }) {
    const [loadingProductId, setLoadingProductId] = useState(null);
    const router = useRouter();
    const handleAddToCart = async (product) => {
        const token = await getServerCookie('token');

        if (!token) {
            toast.info("Please log in to add products to your cart!");
            return;
        }

        setLoadingProductId(product._id);

        const cleanPrice = parseFloat(product.discountPrice);
        const productData = {
            productId: product._id,
            img_src: product.images[0],
            name: product.name,
            price: cleanPrice,
            quantity: 1,
        };

        try {
            const response = await axios.post("/api/cart/add", productData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });

            toast.success("Product added to cart!");
        } catch (err) {
            toast.error("Failed to add product to cart!");
        } finally {
            setLoadingProductId(null);
        }
    };

     const handleBuyNow = async (product) => {
        const data = { productId: product._id, name: product.name, quantity: 1, img_src: product.images[0], price: product.price, discountedPrice: product.discountPrice, category: product.category.name, SKU: product.sku };
        dispatch(addToCart(data));
        router.push('/checkout');
      };

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products?.map((product,ind) => (
                <div
                    key={`prodImage ${ind}`}
                    className="bg-white rounded-lg p-4 hover:shadow-xl transition-[--tw-shadow]"
                >
                    <Image
                        width={133}
                        height={150}
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-52 object-cover rounded-lg mb-4"
                    />
                    <div className="px-1">
                        <div className="flex justify-between items-center gap-2 mt-2">
                            <div className="flex justify-center items-center gap-2">
                                <span className="text-[#1E1E1E] font-semibold text-base">
                                    {product.discountPrice}
                                </span>
                                <span className="line-through text-[#F42222] text-xs">
                                    {product.price}
                                </span>
                            </div>
                            <div className="text-sm text-gray-500 mt-2 flex justify-center items-center gap-2">
                                <span className="text-[#F42222]">★</span>
                            </div>
                        </div>
                        <div className="text-gray-600">{product.name}</div>
                    </div>
                    <Button
                        className="mt-4 bg-[#F8C0BF] hover:bg-[#fe6161] transition-colors py-2 duration-300 px-4 rounded-md w-full capitalize text-sm"
                        onClick={() => handleAddToCart(product)}
                        disabled={loadingProductId === product._id}
                    >
                        {loadingProductId === product._id ? "Adding..." : "Add to Cart"}
                    </Button>
                    <Button
                        className="mt-4 bg-[#F8C0BF] hover:bg-[#fe6161] transition-colors py-2 duration-300 px-4 rounded-md w-full capitalize text-sm"
                        onClick={() => handleBuyNow(product)}
                       
                    >
                        Buy Now
                    </Button>
                </div>
            ))}
        </div>
    );
}
