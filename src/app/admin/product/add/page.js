"use client";
import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import axios from "axios";
import dynamic from 'next/dynamic';
import {
  Accordion,AccordionHeader,AccordionBody,Alert
} from "@/MaterialTailwindNext";
const JoditEditor = dynamic(() => import('jodit-react'), {
  ssr: false,
});
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./product.css";
import { Badge } from "@material-tailwind/react";
import calculatedDiscount from "@/utils/productDiscount";

// Validation schema using Yup
const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const productSchema = Yup.object().shape({
  name: Yup.string().required("Product name is required"),
  price: Yup.number().positive("Price must be positive").required("Price is required"),
  discountPrice: Yup.number()
    .required('Discounted price is required')
    .test('is-less-than-price', 'Discounted price must be less than price', function (value) {
      const { price } = this.parent;
      return value < price;
    }),
  category: Yup.string().required("Category is required"),
  subCategory: Yup.string().required("Sub-Category is required"),
  stock: Yup.number().integer("Stock must be a whole number"),
  description: Yup.string().required("Description is required").min(50,'Description must have at least 50 characters'),
  images: Yup.mixed().test('fileSize', 'File too large', (value) => {
    if (value?.length) {
      return value.every((file) => file.size <= MAX_FILE_SIZE);
    }
    return true;
  })
  .test('fileFormat', 'Unsupported Format', (value) => {
    if (value?.length) {
      return value.every((file) => SUPPORTED_FORMATS.includes(file.type));
    }
    return true;
  }).test("required", "Please upload at least one image", (value) => value && value.length > 0),
  collection: Yup.string(),
  metal: Yup.string(),
});

function Icon({ id, open }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`${id === open ? "rotate-180" : ""} h-5 w-5 transition-transform`}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  );
}
 
function AlertIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="h-6 w-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
      />
    </svg>
  );
}
export default function AddNewProduct() {
  const { register, handleSubmit, setValue, control, formState: { errors }, reset } = useForm({
    resolver: yupResolver(productSchema),
  });
  const collections = ['Hot picks','Top Products'];
  const fileInput = useRef(null);
  const categories= ['men','women'];
  const [subCategories, setSubCategories] = useState([]);
  const [preview, setPreview] = useState([]);
  const [ImageFile, setImageFile] = useState([]);
  const [data, setData] = useState([]);
  const [open, setOpen] = React.useState(1);
  const price = useWatch({ control, name: 'price' });
  const discountedPrice = useWatch({ control, name: 'discountPrice' });
 
  const handleOpen = (value) => setOpen(open === value ? 0 : value);
 

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 0) {
      const previewsURL = files.map((file) => URL.createObjectURL(file));
      const updatedFiles = [...ImageFile,...files];
      setImageFile(updatedFiles);
      setPreview((prevPreviews) => [...prevPreviews, ...previewsURL]);
      setValue('images',updatedFiles)
      document.querySelector(".postform").classList.add("jadu"); // Assuming this is for some style changes
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/categories/options");
        setData(response.data);
        console.log(response.data)
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);


  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    const filteredSubCategories = data.filter((category) => category.parentCategory === selectedCategory);
    console.log(filteredSubCategories)
    setSubCategories(filteredSubCategories);
  };
  const FilterImages = (idx)=>{
    const filtered = ImageFile.filter((file,ind) => ind !== idx);
    const filteredpreview = preview.filter((file,ind) => ind !== idx);
    setValue('images',filtered);
    setImageFile(filtered);
    setPreview(filteredpreview);
  }

  const onSubmit = async (formData) => {
    try {
      console.log(formData)
      const form = new FormData();
      form.append("name", formData.name);
      form.append("description", formData.description);
      form.append("price", formData.price);
      form.append("discountPrice", formData.discountPrice);
      form.append("category", formData.category);
      form.append("subCategory", formData.subCategory);
     form.append("stock", formData.stock);
      form.append("metal", formData.metal);
      if( formData.collection) form.append("collectionName", formData.collection);
      // Add images
      Array.from(formData.images).forEach((image) => form.append("images", image));

      await axios.post("/api/products", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      document.querySelector(".postform").classList.remove("jadu");
      toast.success("Product added successfully!");
      reset(); // Reset form after successful submission
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add product");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="mysite">
        <div className="postform">
          <h1>Add Product</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Image Upload */}
            <div className="upload-box" onClick={() => fileInput.current.click()}>
            <Controller
                name="images"
                control={control}
                render={({ field }) => (      
                    <input
                      type="file"
                      accept="image/jpg , image/jpeg , image/png"
                      multiple
                      ref={fileInput}
                      hidden
                      onChange={handleImageChange}
                    />)}/>

              
              <div className="upload-item ">
              <img
                src="https://www.codingnepalweb.com/demos/resize-and-compress-image-javascript/upload-icon.svg"
                alt="Upload"
                id="postimage"
              />
              <p>Browse File to Upload Product Image</p>
              </div>
            </div>

            <div className="content space-y-3">
            <div className="overflow-x-scroll flex gap-2 pt-3 ">
            <div className=" bg-[#F8C0BF] rounded-md  p-7" onClick={()=> fileInput.current.click()}>
                    <img
                src="https://www.codingnepalweb.com/demos/resize-and-compress-image-javascript/upload-icon.svg"
                alt="Upload"
                id="postimage"
                className="mx-auto w-12 mb-2 "
              />
              <p className=" whitespace-nowrap">Add more</p>
                    </div>
                {preview.length > 0 && (
                  <>
                  
                  <div className="flex gap-3  ">
                    {preview.map((preview, index) => (
                      <Badge  content="X"  color="#F8C0BF" onClick={()=>FilterImages(index)}>
                        <div className="w-32 h-32">
                      <img
                        key={index}
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-32 h-32 object-cover rounded"
                      />
                      </div>
                      </Badge>
                    ))}
                    
                  </div>
                  </>
                )}
              </div>
                <p className="error text-red-500 text-sm">{errors.images?.message}</p>
                 {/* Product Name */}
                 <div className="">
                  <label className="block text-lg font-medium mb-1">Product Name</label>
                  <input
                    {...register("name")}
                    className={`form-input ${errors.name ? "is-invalid" : ""} w-full h-12 px-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500 `}
                    placeholder="Enter product name"
                  />
                  <p className="error text-red-500 text-sm">{errors.name?.message}</p>
                </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Category */}
                <div>
                  <label className="block text-lg font-medium mb-1">Category</label>
                  <select
                    {...register("category")}
                    onChange={handleCategoryChange}
                    className={`form-input ${errors.category ? "is-invalid" : ""} w-full h-12 px-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500`}
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat,ind) => (
                      <option key={ind} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <p className="error text-red-500 text-sm">{errors.category?.message}</p>
                </div>

                {/* Sub-Category */}
                <div>
                  <label className="block text-lg font-medium mb-1">Sub-Category</label>
                  <select
                    {...register("subCategory")}
                    disabled={!subCategories.length}
                    className={`form-input ${errors.subCategory ? "is-invalid" : ""} w-full h-12 px-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500`}
                  >
                    <option value="">Select Sub-Category</option>
                    {subCategories.map((sub,ind) => (
                      <option key={ind} value={sub.name}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                  <p className="error text-red-500 text-sm">{errors.subCategory?.message}</p>
                </div>

                 {/* Price */}
                  <div>
                  <label className="block text-lg font-medium mb-1">Price</label>
                  <input
                    type="number"
                    {...register("price")}
                    className={`form-input ${errors.price ? "is-invalid" : ""} w-full h-12 px-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500`}
                    placeholder="Enter product price"
                  />
                  <p className="error text-red-500 text-sm">{errors.price?.message}</p>
                </div>

                 {/* DiscountPrice */}
                 <div>
                  <label className="block text-lg font-medium mb-1">DiscountPrice</label>
                  <input
                    type="number"
                    {...register("discountPrice")}
                    className={`form-input ${errors.discountPrice ? "is-invalid" : ""} w-full h-12 px-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500`}
                    placeholder="Enter product price"
                  />
                  <p className="error text-red-500 text-sm">{errors.discountPrice?.message}</p>
                </div>
                
              </div>
              {price && discountedPrice  && <div><Alert color="green" icon={<AlertIcon />}>{calculatedDiscount(price,discountedPrice)} Discount Applied</Alert></div>}
                {/* Description using Jodit */}
              <div>
                  <label className="block text-lg font-medium mb-1">Description</label>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <JoditEditor value={field.value} onChange={field.onChange} />
                    )}
                  />
                  <p className="error text-red-500 text-sm">{errors.description?.message}</p>
                </div>
                <Accordion open={open === 1} icon={<Icon id={1} open={open} />}
                >
        <AccordionHeader onClick={() => handleOpen(1)} color="red">Defalut Fields</AccordionHeader>
        <AccordionBody>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">



{/* Stock */}
<div>
  <label className="block text-lg font-medium mb-1" >Stock</label>
  <input
    type="number"
    {...register("stock")}
    className={`form-input ${errors.stock ? "is-invalid" : ""} w-full h-12 px-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500`}
    placeholder="Enter stock quantity"
    defaultValue={0}
  />
  <p className="error text-red-500 text-sm">{errors.stock?.message}</p>
</div>

{/* collection */}
<div>
  <label className="block text-lg font-medium mb-1">Collection</label>
  <select
    {...register("collection")}
    className={`form-input ${errors.collection ? "is-invalid" : ""} w-full h-12 px-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500`}
  >
    <option value="">Select Collection</option>
    {collections.map((cat,ind) => (
      <option key={ind} value={cat}>
        {cat}
      </option>
    ))}
  </select>
  <p className="error text-red-500 text-sm">{errors.collection?.message}</p>
</div>

{/* metal */}
<div>
  <label className="block text-lg font-medium mb-1">Metal</label>
  <select
    {...register("metal")}
    className={`form-input ${errors.metal ? "is-invalid" : ""} w-full h-12 px-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500`}
    defaultValue='silver'
  >
      <option key="silver" value='silver'>Silver</option>
      <option key="gold" value='gold'>Gold</option>
  </select>
  <p className="error text-red-500 text-sm">{errors.metal?.message}</p>
</div>

</div>
        </AccordionBody>
      </Accordion>

              <button type="submit" className="submit-btn">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
