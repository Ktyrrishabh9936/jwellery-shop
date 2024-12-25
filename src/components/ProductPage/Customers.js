"use client";
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Star from '@/assets/Star.svg';
import { getServerCookie } from "@/utils/serverCookie";
import { useSelector } from 'react-redux';

export default function Customers({ productId }) {
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

    // Fetch existing reviews
    const handleShowMore = () => {
        if (page < totalPages) {
          setPage((prev) => prev + 1);
        }
      };
    const fetchReviews = async (page) => {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/products/${productId}/reviews`);
          const data = await response.json();
          
          if (response.ok) {
            console.log(data)
            setReviews((prev) => [...prev, ...data?.reviews]);
            // setTotalPages(data.totalPages);
          } else {
            console.error(data.message);
          }
        } catch (error) {
          console.error('Error fetching reviews:', error.message);
        } finally {
          setIsLoading(false);
        }
      };
      const {user} = useSelector((store)=>store.user);
    useEffect(() => {
        fetchReviews(page);
    }, [productId,page]);

    // Submit a new review
    const submitReview = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error("Please log in to add review");
            return;
          }
  

        if (rating < 1 || rating > 5 || !comment.trim()) {
            toast.error('Please provide a valid rating and comment.');
            return;
        }

        try {
            const res = await fetch(`/api/products/${productId}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rating, comment })
            });
            const data = await res.json();

            if (res.ok) {
                setReviews((prev) => [...prev,{...data?.review,user:{name:user.name}} ]);
                console.log(data)
                setRating(0);
                setComment('');
                toast.success('Review submitted successfully!');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.');
        }
    };

    return (
        <div className="py-5 bg-white ">
            <h2 className="my-3 font-semibold text-xl">Customer Reviews</h2>

            {/* Review Form */}
            <form onSubmit={submitReview} className="my-4">
                <div className="flex gap-2 items-center">
                    <label className="font-medium text-gray-700">Rating:</label>
                    {[1, 2, 3, 4, 5].map((num) => (
                        <button
                            key={num}
                            type="button"
                            onClick={() => setRating(num)}
                            className={`w-6 h-6 ${rating >= num ? 'text-red-500' : 'text-gray-300'}`}
                        >
                            <Star />
                        </button>
                    ))}
                </div>

                <textarea
                    className="w-full p-2 mt-2 border border-gray-300 rounded bg-gray-50 focus:outline-none focus:border-pink-400"
                    placeholder="Write your review here"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />

                <button
                    type="submit"
                    className="mt-2 px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
                >
                    Submit Review
                </button>
            </form>

            {/* Display Reviews */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                { reviews.length > 0 && reviews.map((review, idx) => (
                    <ReviewItem key={idx} review={review} />
                ))}
            </div>
            {page < totalPages && (
        <button onClick={handleShowMore} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Show More'}
        </button>
      )}
        </div>
    );
}

function ReviewItem({ review }) {
    return (
        <blockquote className="flex h-full flex-col justify-between bg-gray-50 p-6 shadow-md rounded-lg">
            <div className="flex gap-0.5 text-red-500">
                {Array.from({ length: review?.rating }).map((_, i) => (
                    <span key={i} className="w-6"><Star /></span>
                ))}
            </div>
            <div className="mt-4">
                <p className="text-xl font-bold text-gray-800">{review?.user ? review?.user?.name: 'Anonymous'}</p>
                <p className="mt-4 leading-relaxed text-gray-700">{review?.comment}</p>
            </div>
            <footer className="mt-4 text-sm font-medium text-gray-500">
                &mdash; {review?.user ? review?.user?.name: 'Anonymous'}
            </footer>
        </blockquote>
    );
}
