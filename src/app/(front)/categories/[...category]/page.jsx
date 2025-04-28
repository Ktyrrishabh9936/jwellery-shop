"use client"

import { useCallback, useEffect, useState } from 'react'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon, FunnelIcon, MinusIcon, PlusIcon, Squares2X2Icon } from '@heroicons/react/20/solid'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation'
import { fetchfilteredProducts, fetchMorefiltered } from '@/lib/reducers/productReducer'
import { fetchCategories } from '@/lib/reducers/categoryReducer'
import Link from 'next/link'
import CatlogPriceFilter from './myslider'
import debounce from "lodash/debounce";
import InfiniteScroll from 'react-infinite-scroll-component'
import { Button } from '@material-tailwind/react'
import { addToCart } from '@/lib/reducers/cartReducer'
import Skel from '@skel-ui/react'
import { formatPrice } from '@/utils/productDiscount'
import Image from 'next/image'
import ProductGridLoader from '@/components/Loaders/ProductGridLoader'
import { collections } from '@/utils/NavData'
const sortOptions = [
  { name: 'Most Popular', href: '', current: true },
  { name: 'Best Rating', href: 'best_rating', current: false },
  { name: 'Newest', href: 'newest', current: false },
  { name: 'Price: Low to High', href: 'price_low', current: false },
  { name: 'Price: High to Low', href: 'price_high', current: false },
]

const filters = [
  {
    id: 'collection',
    name: 'Collection',
    multiple: true,
    options: collections,
  },
  {
    id: 'shopFor',
    name: 'Shop For',
    multiple: false,
    options: [
      { value: 'men', label: 'Men', },
      { value: 'women', label: 'Women', },
    ],
  },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default  function Example() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [data, setData] = useState({});
    const {categories,loading,isfetched}= useSelector((state)=>state.categories)
    const pathname = usePathname();
    const dispatch = useDispatch();
    const searchParams = useSearchParams();
    const {category} = useParams();
    const collection = searchParams.get('collection');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const shopFor = searchParams.get('shopFor');
    const sort = searchParams.get('sort');
    
   
    useEffect(()=>{
        if(!isfetched){
          dispatch(fetchCategories());
        }
    },[])
    const {filteredProducts} = useSelector(store=>store);
    const [priceRange, setPriceRange] = useState({ minPrice: 0, maxPrice: 3000 });
    const router = useRouter();
    const {user} = useSelector((store)=>store.user);
const {loadingProductId} = useSelector((state)=>state.cart)
   
  const [selectedFilters, setSelectedFilters] = useState({
    collection: '',
    shopFor: '',
    minPrice: 0, maxPrice: 0 ,sort:""
  });


  const setParams = (object) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(object)) {
      if(value){
      params.set(key,value);
      }
  }
    router.push(`?${params.toString()}`);
  };
    const updatePriceParams =useCallback(debounce(  (object) => {
      setParams(object)
      },1000),[]);
  const setMinPrice = (val) => {
    setSelectedFilters((prev) =>  {
      const data = {...prev, minPrice: val};
      updatePriceParams(data)
      return data;
          }
    );
    
  };
  const ResetPrice = () => {
    setSelectedFilters((prev) =>  {
      const data  =  {...prev,  maxPrice: 0,minPrice:0 }
      setParams(data)
      return data;
  });
  };
  const setMaxPrice = (val) => {
    setSelectedFilters((prev) =>  {
      const data  =  {...prev,  maxPrice: val }
      updatePriceParams(data)
      return data;
  });
  };
  const fetchmoreData = ()=>{
    setData({...data, pageNumber:data.pageNumber+1});
    dispatch(fetchMorefiltered({...data, pageNumber:data.pageNumber+1}))
  }
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPriceRange({ ...priceRange, [name]: Number(value) });
  };
  const handleAddToCart = async (product) => {
      const data = { productId:product._id,name:product.name,quantity:1,img_src:product.images[0],price:product.price,discountedPrice:product.discountPrice,category:product.category.name,SKU:product.sku}
  
      dispatch(addToCart(data))
    };
  const handleFilterChange = (filterId, value, multiple) => {
    setSelectedFilters((prev) => {
      const updatedFilters = { ...prev };

      if (multiple) {
        const currentValues = updatedFilters[filterId] ? updatedFilters[filterId].split(',') : [];
        if (currentValues.includes(value)) {
          // Remove the value if already selected
          updatedFilters[filterId] = currentValues.filter((v) => v !== value).join(',');
        } else {
          // Add the value if not already selected
          updatedFilters[filterId] = [...currentValues, value].join(',');
        }
      } else {
        // For single-selection filters, directly set the value
        updatedFilters[filterId] = value;
      }
      setParams(updatedFilters);
      return updatedFilters;
    });
  };
  
  const resetFilters = () => {
    setSelectedFilters({
      collection: '',
      minPrice: 0,
      shopFor: '',
      maxPrice:0
    });
  };
  useEffect(()=>{
    let parameter = {
      category:category.join(','),
      collection:collection||[],
      minPrice,
      maxPrice,
      shopFor,
      sort:sort,
      pageNumber:1,
      pageSize:10,
    }
    setSelectedFilters({collection,minPrice,maxPrice,shopFor})
    setData(parameter);
    console.log(parameter)
    dispatch(fetchfilteredProducts(parameter))
  },[category,collection,minPrice,maxPrice,shopFor,sort])
  return (
    <div className="bg-white">
      <div>
        {/* Mobile filter dialog */}
        <Dialog open={mobileFiltersOpen} onClose={setMobileFiltersOpen} className="relative z-40 lg:hidden">
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
          />

          <div className="fixed inset-0 z-40 flex">
            <DialogPanel
              transition
              className="relative ml-auto flex size-full max-w-xs transform flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl transition duration-300 ease-in-out data-[closed]:translate-x-full"
            >
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="-mr-2 flex size-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon aria-hidden="true" className="size-6" />
                </button>
              </div>

              {/* Filters */}
              <form className="mt-4 px-5 border-t border-gray-200">
               

              {filters.map((section) => (
        <Disclosure key={section.id} as="div" className="border-b pl-2 border-gray-200 py-6">
          <h3 className="-my-3 flow-root">
            <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
              <span className="font-medium text-gray-900">{section.name}</span>
              <span className="ml-6 flex items-center">
                <PlusIcon aria-hidden="true" className="size-5 group-data-[open]:hidden text-pink-500" />
                <MinusIcon aria-hidden="true" className="size-5 group-[&:not([data-open])]:hidden text-pink-500" />
              </span>
            </DisclosureButton>
          </h3>
          <DisclosurePanel className="pt-6">
            <div className="space-y-4">
              {section.options.map((option, idx) => (
                <div key={option.value} className="flex gap-3">
                  <input
                    type="checkbox"
                    className="w-5 h-5 star appearance-none cursor-pointer border text-blue-gray-600 border-gray-300  rounded-md mr-2 hover:border-indigo-500 hover:bg-indigo-100 checked:bg-no-repeat checked:bg-center checked:border-indigo-500 checked:bg-indigo-100"
                    id={`filter-${section.id}-${idx}`}
                    name={`${section.id}[]`}
                    value={option.value}
                    checked={
                      section.multiple
                        ? selectedFilters[section.id]?.split(',').includes(option.value)
                        : selectedFilters[section.id] === option.value
                    }
                    onChange={() => handleFilterChange(section.id, option.value, section.multiple)}
                    
                  />
           
                  <label htmlFor={`filter-${section.id}-${idx}`} className="cursor-pointer ml-2 text-slate-600  text-sm text-gray-600">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </DisclosurePanel>
        </Disclosure>
      ))}
      <div
      style={{
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "5px",
        boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2>Price Range</h2>
      <p>Use the slider to select a price range:</p>

  <CatlogPriceFilter sliderMinValue={priceRange.minPrice} sliderMaxValue={priceRange.maxPrice}  minVal={selectedFilters.minPrice} maxVal={selectedFilters.maxPrice} setMaxVal={setMaxPrice} setMinVal={setMinPrice}/> 

      {/* Input Fields for Min and Max Price */}
      <div className=' flex justify-center my-3'>

        <div className='flex flex-col '>
          <label htmlFor="maxPrice h-min my-auto text-center">Max Range</label>
          <input
            type="number"
            id="maxPrice"
            name="maxPrice"
            value={priceRange.maxPrice}
            onChange={handleInputChange}
            min={priceRange.minPrice}
            max={20000}
            maxLength={5}
            minLength={10}
            className=' bg-blue-gray-50 rounded-lg py-2 px-5 '
          />
        </div>

      </div>
      <button type='button' onClick={ResetPrice} className=' bg-gray-500 py-1 px-3 rounded-md hover:text-white hover:bg-red-300' >Reset Price</button>
    </div>
 
              </form>
            </DialogPanel>
          </div>
        </Dialog>

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-5 sm:pt-12">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 capitalize">{category.join(" and ")}</h1>

            <div className="flex items-center">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <MenuButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900 capitalize">
                    {sort ? sort : "Sort"}
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="-mr-1 ml-1 size-5 shrink-0 text-gray-400 group-hover:text-gray-500"
                    />
                  </MenuButton>
                </div>

                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  <div className="py-1">
                    {sortOptions.map((option) => (
                      <MenuItem key={option.name}>
                        <div
                          onClick={() => handleFilterChange('sort', option.href, false)}
                          className={classNames(
                            sort === option.href ? 'font-medium text-gray-900' : 'text-gray-500',
                            'block px-4 py-2 text-sm data-[focus]:bg-gray-100 data-[focus]:outline-none',
                          )}
                        >
                          {option.name}
                        </div>
                      </MenuItem>
                    ))}
                  </div>
                </MenuItems>
              </Menu>

              <button
                             onClick={resetFilters}
                             className="text-sm ml-3 font-medium bg-gray-100 border-2 border-gray-500 text-gray-700 py-1.5 px-3 rounded-full shadow-md hover:bg-[rgba(196,30,86,0.2)] hover:text-[rgba(196,30,86,1)] hover:hover:border-[rgba(196,30,86,1)]  transform transition-all hover:scale-105"
                           >
                             Clear Filters
                           </button>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon aria-hidden="true" className="size-5" />
              </button>
            </div>
          </div>
           <div className="my-4">
        {/* <p className="flex gap-2 w-full border-none font-Poppins text-[clamp(0.8rem,1.1vw,1.2rem)] rounded-full h-min my-auto p-2">
          {Object.entries(selectedFilters).flatMap(([filterId, value]) =>
            value
              .split(',')
              .filter(Boolean)
              .map((val) => (
                <em
                  key={`${filterId}-${val}`}
                  className="px-3 py-1 rounded-full bg-blue-200 h-min min-w-max cursor-pointer"
                  onClick={() => handleRemoveFilter(filterId, val)}
                >
                  {filters
                    .find((f) => f.id === filterId)
                    ?.options.find((option) => option.value === val)?.label || val}
                </em>
              ))
          )}
        </p> */}
      </div>

          <section aria-labelledby="products-heading" className="pb-24 pt-6">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              {/* Filters */}
              <form className="hidden lg:block">
               

                {filters.map((section) => (
        <Disclosure key={section.id} as="div" className="border-b pl-2 border-gray-200 py-6">
          <h3 className="-my-3 flow-root">
            <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
              <span className="font-medium text-gray-900">{section.name}</span>
              <span className="ml-6 flex items-center">
                <PlusIcon aria-hidden="true" className="size-5 group-data-[open]:hidden text-pink-500" />
                <MinusIcon aria-hidden="true" className="size-5 group-[&:not([data-open])]:hidden text-pink-500" />
              </span>
            </DisclosureButton>
          </h3>
          <DisclosurePanel className="pt-6">
            <div className="space-y-4">
              {section.options.map((option, idx) => (
                <div key={option.value} className="flex gap-3">
                  <input
                    type="checkbox"
                    className="w-5 h-5 star appearance-none cursor-pointer border text-blue-gray-600 border-gray-300  rounded-md mr-2 hover:border-indigo-500 hover:bg-indigo-100 checked:bg-no-repeat checked:bg-center checked:border-indigo-500 checked:bg-indigo-100"
                    id={`filter-${section.id}-${idx}`}
                    name={`${section.id}[]`}
                    value={option.value}
                    checked={
                      section.multiple
                        ? selectedFilters[section.id]?.split(',').includes(option.value)
                        : selectedFilters[section.id] === option.value
                    }
                    onChange={() => handleFilterChange(section.id, option.value, section.multiple)}
                    
                  />
           
                  <label htmlFor={`filter-${section.id}-${idx}`} className="cursor-pointer ml-2 text-slate-600  text-sm text-gray-600">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </DisclosurePanel>
        </Disclosure>
      ))}
      <div
      style={{
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "5px",
        boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2>Price Range</h2>
      <p>Use the slider to select a price range:</p>

  <CatlogPriceFilter sliderMinValue={priceRange.minPrice} sliderMaxValue={priceRange.maxPrice}  minVal={selectedFilters.minPrice} maxVal={selectedFilters.maxPrice} setMaxVal={setMaxPrice} setMinVal={setMinPrice}/> 

      {/* Input Fields for Min and Max Price */}
      <div className=' flex justify-center my-3'>

        <div className='flex flex-col '>
          <label htmlFor="maxPrice h-min my-auto text-center">Max Range</label>
          <input
            type="number"
            id="maxPrice"
            name="maxPrice"
            value={priceRange.maxPrice}
            onChange={handleInputChange}
            min={priceRange.minPrice}
            max={20000}
            maxLength={5}
            minLength={10}
            className=' bg-blue-gray-50 rounded-lg py-2 px-5 '
          />
        </div>

      </div>
      <button type='button' onClick={ResetPrice} className=' bg-gray-500 py-1 px-3 rounded-md hover:text-white hover:bg-red-300' >Reset Price</button>
    </div>
 
      
              </form>

         
              <div className="lg:col-span-3">{/* Your content */}     
                   {filteredProducts.isLoading ? <ProductGridLoader/>: !filteredProducts.products?.length ? 
                     <div className="min-w-screen min-h-screen bg-gray-100 flex items-center justify-center p-5 lg:p-20 overflow-hidden relative">
                     <div className="flex-1 max-w-4xl rounded-3xl bg-white shadow-xl p-10 lg:p-20 text-gray-800 relative flex items-center text-center md:text-left">
                       <div className="w-full md:w-1/2">
                         <div className="mb-7 lg:mb-10">
                           <Image src="/images/logo_1.png" width={80} height={15} alt="Logo" />
                         </div>
                         <div className="mb-10 md:mb-20 text-gray-600 font-light">
                           <h1 className="font-black uppercase text-3xl lg:text-5xl text-blue-500 mb-5">
                             Oops! No Results Found
                           </h1>
                           <p className="mb-2">
                             It seems we couldn't find any items that match your filters.
                           </p>
                           <p>
                             Try adjusting the filters or clear them to explore all available products.
                           </p>
                         </div>
                         <div>
                           <button
                             onClick={resetFilters}
                             className="text-lg font-medium bg-blue-500 text-white py-3 px-6 rounded-md shadow-md hover:bg-blue-600 transform transition-all hover:scale-105"
                           >
                             Clear Filters
                           </button>
                         </div>
                       </div>
                       <div className="w-full md:w-1/2 text-center">
                         <img
                           src="/no-results.avif"
                           alt="No results"
                           className="max-w-full mx-auto"
                         />
                         <a
                           href="https://www.freepik.com/vectors/business"
                           target="_blank"
                           rel="noopener noreferrer"
                           className="text-xs text-gray-300 mt-4 block"
                         >
                           Business vector created by pikisuperstar - www.freepik.com
                         </a>
                       </div>
                     </div>
                     <div className="w-64 md:w-96 h-96 md:h-full bg-blue-200 bg-opacity-30 absolute -top-64 md:-top-96 left-20 md:left-32 rounded-full pointer-events-none -rotate-45 transform"></div>
                     <div className="w-96 h-full bg-yellow-200 bg-opacity-20 absolute -bottom-96 left-64 rounded-full pointer-events-none -rotate-45 transform"></div>
                   </div>
                   : <InfiniteScroll
        dataLength={filteredProducts.products?.length}
        next = {()=>fetchmoreData(data)}
        hasMore={filteredProducts?.currentPage < filteredProducts?.totalPages}
        loader={<ProductGridLoader/> }
        >
    
    <div className="grid grid-cols-2 md:grid-cols-3  gap-y-2 md:gap-y-4">
    { filteredProducts.products?.map((product,ind) => (
      <div
        key={ind}
        className="bg-white rounded-lg p-2 md:p-4 shadow-none md:hover:shadow-xl transition-[--tw-shadow] "
      >
        <Link href={`/product/${product._id}`} >
        <Image
          width={300}
          height={300}
          loading="lazy"
          src={process.env.NEXT_PUBLIC_IMAGE_URL +product.images[0]}
          alt={`product${ind}`}
          className="w-full h-[clamp(14rem,21vw,23rem)] md:h-[clamp(11rem,18vw,20rem)] object-cover rounded-lg "
        />
          <div className="flex justify-between items-center gap-2 mt-2">
            <div className="flex  items-center gap-x-2  line-clamp-1 w-[90%]">
              <span className="text-[#1E1E1E] font-semibold text-sm md:text-base ">
                {formatPrice(product.discountPrice)}
              </span>
              <strike className=" text-[#F42222] text-xs  line-clamp-1">
                {formatPrice(product.price)}
              </strike>
            </div>
            <div className="text-sm text-gray-500  flex justify-center items-center gap-2 w-[40px]">
              <span className="text-[#F42222]">★</span>
              <span>{product.averageRating.toFixed(1)}</span>
            </div>
          </div>
          <div className="text-gray-600 line-clamp-1">{product.name}</div>
        </Link>
        <Button
          className="mt-4 bg-[#F8C0BF] hover:bg-[#fe6161] transition-colors py-2 duration-300 px-4 rounded-md w-full capitalize text-sm"
          onClick={() => handleAddToCart(product)}
          disabled={loadingProductId === product._id}
        >
          {loadingProductId === product._id ? "Adding..." : "Add to Cart"}
        </Button>
      </div>
    ))}
  </div>
  
    </InfiniteScroll>
      }</div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
