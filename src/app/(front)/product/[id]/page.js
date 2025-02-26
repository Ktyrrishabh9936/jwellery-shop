"use client"
import Product from "@/components/ProductPage/Product";
import Footer from "@/components/HomePage/Footer";
import { useParams } from "next/navigation";


export  default  function Page() {
    const {id} = useParams();
    return( <>
        <div className="p-0 md:p-2">
            <Product id={id} />
        </div>
       <Footer/>
    </>
    )
}