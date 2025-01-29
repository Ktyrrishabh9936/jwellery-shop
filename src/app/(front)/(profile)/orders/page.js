'use client'

import { fetchOrders } from '@/lib/reducers/orderReducer';
import axios from 'axios';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const MyOrders = () => {
  const dispatch = useDispatch();
  const { orders, currentPage, totalPages, loading } = useSelector((state) => state.orders);
  const navigate = useRouter();
  const [showCancel, setShowCancel] = useState(false);
  const [cancelId,setCancelId]=useState(null);
  const [reason, setReason] = useState("");
  const [upiId, setUpiId] = useState("");

  useEffect(() => {
    dispatch(fetchOrders({ page: 1, limit: 5 }));
  }, [dispatch]);

  const handlePageChange = (page) => {
    dispatch(fetchOrders({ page, limit: 5 }));
  };

  const handleCancel = (e) => {
    console.log(e);
    setCancelId(e);
    setShowCancel(true);
  }

  const handleCancelForm=async (e)=>{
      e.preventDefault();
      try {
        const response = await axios.post(`/api/orders/cancellation/${cancelId}`, {
          reason,
          upiId,
        });
        console.log('Response:', response.data);
        alert(`${response.data.message} `|| `Cancalled Sucessfully`)
        setShowCancel(false);
      } catch (error) {
        console.error('Error cancelling order:', error.response?.data || error.message);
      }
  }

  return (
    <>

      <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <div className="mx-auto max-w-5xl">
            <div className="gap-4 sm:flex sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">My orders</h2>

            </div>

            <div className="mt-6 flow-root sm:mt-8 ">
              {loading ? (
                <div className="space-y-4">
                  {Array(5).fill(0).map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-6 bg-gray-200 rounded w-full mb-2"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700  flex flex-col-reverse">
                  {orders.length !== 0 ? orders.map((order, index) => <div key={index} className="flex flex-wrap items-center gap-y-4 py-6">
                    <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                      <dt className="text-base font-medium text-gray-500 dark:text-gray-400">Order ID:</dt>
                      <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                        <p className="hover:underline">{order.orderID}</p>
                      </dd>
                    </dl>

                    <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                      <dt className="text-base font-medium text-gray-500 dark:text-gray-400">Date:</dt>
                      <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">{new Date(order.createdAt).toLocaleDateString()}</dd>
                    </dl>

                    <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                      <dt className="text-base font-medium text-gray-500 dark:text-gray-400">Price:</dt>
                      <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">Rs. {order?.amount}</dd>
                    </dl>

                    <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                      <dt className="text-base font-medium text-gray-500 dark:text-gray-400">Status:</dt>
                      {order?.payment?.mode === "Prepaid" ? <dd className="me-2 mt-1.5 inline-flex items-center rounded bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                        <svg className="me-1 h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 11.917 9.724 16.5 19 7.5" />
                        </svg>
                        Perpaid
                      </dd>
                        : <dd className="me-2 mt-1.5 inline-flex items-center rounded bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                          <svg className="me-1 h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h6l2 4m-8-4v8m0-8V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v9h2m8 0H9m4 0h2m4 0h2v-4m0 0h-5m3.5 5.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm-10 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z" />
                          </svg>
                          Cash on delivery
                        </dd>}
                    </dl>

                    <div className="w-full grid sm:grid-cols-2 lg:flex lg:w-64 lg:items-center lg:justify-end gap-4">
                      <button type="button" className="w-full rounded-lg border border-red-700 px-3 py-2 text-center text-sm font-medium text-red-700 hover:bg-red-700 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white dark:focus:ring-red-900 lg:w-auto"
                        onClick={() => handleCancel(order.orderID)}>
                        Cancel order
                      </button>
                      <Link href={`/myorderitems/${order.orderID}`} className="w-full inline-flex justify-center rounded-lg  border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 lg:w-auto">View details</Link>
                    </div>
                  </div>) :
                    <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
                      <div className="mx-auto max-w-5xl">
                        <div className="mt-6 flex flex-col items-center justify-center">
                          <img
                            src="/empty-orders.webp"
                            alt="No orders"
                            className="w-64 h-64"
                          />
                          <p className="mt-4 text-gray-500 dark:text-gray-400">You have no orders yet.</p>
                          <button
                            className="mt-6 px-6 py-2 text-white bg-pink-600 hover:bg-pink-700 rounded-md"
                            onClick={() => navigate.push('/')}
                          >
                            Start Shopping
                          </button>
                        </div>
                      </div>
                    </div>
                  }

                </div>
              )}
            </div>

            <nav className="mt-6 flex items-center justify-center sm:mt-8" aria-label="Page navigation example">
              <ul className="flex h-8 items-center -space-x-px text-sm">
                {Array.from({ length: totalPages }, (_, index) => (
                  <li key={index}>
                    <button
                      onClick={() => handlePageChange(index + 1)}
                      className={`flex h-8 items-center justify-center border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${currentPage === index + 1 ? 'z-10 border-primary-300 bg-primary-50 text-primary-600' : ''}`}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </section>
      {
        showCancel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg dark:bg-gray-800">
              <h3 className="text-lg font-semibold text-red-900 dark:text-white">Cancel Order</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Please provide a reason for canceling this order.
              </p>

              <form
                onSubmit={handleCancelForm}
              >
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Reason for cancellation
                  </label>
                  <textarea
                    name="reason"
                    className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:focus:ring-primary-500"
                    required
                    placeholder="Enter the reason for canceling the order"
                    onChange={(e) => setReason(e.target.value)}
                    value={reason}
                  ></textarea>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    UPI ID*
                  </label>
                  <input
                    type="text"
                    name="upiId"
                    required
                    onChange={(e)=>setUpiId(e.target.value)}
                    value={upiId}
                    placeholder='upi@ybl.com'
                    className="mt-1 p-3 block w-full rounded-md border-gray-500 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:focus:ring-primary-500"
                  />
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  I agree to the deduction of payment because of canceling the order.
                </p>

                <div className="mt-6 flex items-center justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowCancel(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600"
                  >
                    Confirm
                  </button>
                </div>
              </form>
            </div>
          </div>
        )
      }

    </>
  );
};

export default MyOrders;
