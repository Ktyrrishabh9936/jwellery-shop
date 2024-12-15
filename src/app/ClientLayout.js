"use client"; 
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Loader from '../components/Loader'; 

export default function ClientLayout({ children }) {
    const [loading, setLoading] = useState(true);
    const pathname = usePathname(); 

    useEffect(() => {
        setLoading(true); 

        
        const timer = setTimeout(() => {
            setLoading(false);
        }, 0);

        return () => clearTimeout(timer); 
    }, [pathname]); 

    return (
        <>
            {loading ? <Loader /> : children} {/* Show loader while loading */}
        </>
    );
}
