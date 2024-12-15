"use client";
import { Button, Input } from "@material-tailwind/react";
import { useState, useCallback } from "react";
import debounce from "lodash/debounce";
import { CiSearch } from "react-icons/ci";

import ProductList from "./ProductList"; 
import { useRouter } from "next/navigation";

export default function Search() {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const router = useRouter();

  
    const handleSearch = (query) => {
        if (query) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
        }
    };

   
    const fetchSuggestions =useCallback(debounce( async (query) => {
        if (query) {
            const res = await fetch(`/api/autocomplete?query=${query}`);
            const data = await res.json();
            setSuggestions(data);
        } else {
            setSuggestions([]);
        }
    },300),[]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        fetchSuggestions(value.trim()); // Fetch suggestions on input change
    };

    const handleSuggestionClick = (suggestion) => {
        setQuery(suggestion);
        setSuggestions([]); // Hide suggestions after selection
        handleSearch(suggestion); // Trigger search with selected suggestion
    };

    return (
        <div className="hidden items-center gap-x-2 lg:flex w-max mx-auto">
            <div className="relative flex w-full gap-2 md:w-max">
                <Input
                    type="search"
                    placeholder="Search"
                    containerProps={{
                        className: "min-w-[288px] rounded-sm",
                    }}
                    className="!border-t-blue-gray-300 pl-9 placeholder:text-[#F42222] !border-black focus:!border-[#F42222]"
                    labelProps={{
                        className: "before:content-none after:content-none",
                    }}
                    value={query}
                    onChange={handleInputChange}
                />
                <div className="!absolute left-3 top-[13px] text-gray-700">
                    <CiSearch />
                </div>
                {/* Autocomplete dropdown */}
                {suggestions.length > 0 && (
                    <div className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded shadow-md z-10">
                        {suggestions.map((suggestion, index) => (
                            <div
                                key={index}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                            >
                                {suggestion}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Button
                size="md"
                className="rounded-lg bg-pink-500"
                onClick={() => handleSearch(query)}
            >
                Search
            </Button>
            
            {/* <ProductList products={products} /> */}
        </div>
    );
}
