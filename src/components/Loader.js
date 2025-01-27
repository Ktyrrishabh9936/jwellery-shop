"use client"; 
import React, { useEffect, useState } from 'react';

const Loader = () => {
    const [showImg, setShowImg] = useState(true);

    useEffect(() => {
        
        setShowImg(true);

        return () => {
            setShowImg(false); 
        };
    }, []);

    return (
        <div className="flex items-center justify-center h-screen bg-background fixed inset-0 z-50">
            {showImg && (
                <div className='loader'></div>
            )}
        </div>
    );
};

export default Loader;
