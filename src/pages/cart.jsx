import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import SummaryApi from '../common/apiConfig';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');

    const fetchCartItems = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const response = await fetch(SummaryApi.showCart.url, {
                method: SummaryApi.showCart.method,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ userId })
            });

            const result = await response.json();
            if (response.ok) {
                setCartItems(result.data);
                // Calculate total
                const cartTotal = result.data.reduce((sum, item) =>
                    sum + (item.productId.price * item.quantity), 0);
                setTotal(cartTotal);
            } else {
                toast.warning(result.message);
            }
        } catch (error) {
            toast.error('Error fetching cart items');
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = async (itemId, change) => {
        const item = cartItems.find(item => item._id === itemId);
        const newQuantity = item.quantity + change;

        if (newQuantity < 1) {
            toast.warning('Quantity cannot be less than 1');
            return;
        }

        try {
            const response = await fetch(SummaryApi.addToCart.url, {
                method: SummaryApi.addToCart.method,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    userId,
                    productId: item.productId._id,
                    quantity: change,
                    isPreOrder: item.isPreOrder,
                    partialPayment: item.partialPayment // Pass current partial payment
                })
            });

            const result = await response.json();
            if (response.ok) {
                fetchCartItems();
                toast.success('Quantity updated successfully');
            } else {
                toast.error(result.message || 'Failed to update quantity');
            }
        } catch (error) {
            toast.error('Error updating quantity');
        }
    };

    const handleRemoveItem = async (itemId) => {
        try {
            const userId = localStorage.getItem('userId');
            const response = await fetch(SummaryApi.removeFromCart.url, {
                method: SummaryApi.removeFromCart.method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ cartItemId: itemId, userId })
            });

            if (response.ok) {
                fetchCartItems();
                toast.success('Item removed from cart');
            }
        } catch (error) {
            toast.error('Error removing item');
        }
    };

    const handleCheckout = async () => {
        if (!phoneNumber.match(/^\d{10}$/)) {
            toast.error('Please enter a valid 10-digit phone number');
            return;
        }

        setIsPlacingOrder(true);
        try {
            const response = await fetch(SummaryApi.checkout.url, {
                method: SummaryApi.checkout.method,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    userId: userId,
                    phoneNumber: phoneNumber
                })
            });

            const result = await response.json();
            if (response.ok) {
                setCartItems([]); // Clear cart
                setTotal(0);
                setIsModalOpen(false);
                toast.success('Order placed successfully! We will notify you soon.');
                navigate('/'); // Optionally redirect to home page
            } else {
                toast.error(result.message || 'Failed to place order');
            }
        } catch (error) {
            toast.error('Error placing order');
            console.error('Checkout error:', error);
        } finally {
            setIsPlacingOrder(false);
        }
    };

    const handleOpenModal = () => {
        setPhoneNumber(''); // Reset phone number
        setIsModalOpen(true);
    };

    useEffect(() => {
        if (userId) {
            fetchCartItems();
        } else {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isModalOpen || isPlacingOrder) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        // Cleanup function
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isModalOpen, isPlacingOrder]);

    // Calculate totals including pre-orders
    const calculateTotals = () => {
        let totalAmount = 0;
        let totalPartialPayment = 0;
        let totalBalancePayment = 0;

        cartItems.forEach(item => {
            const itemTotal = Math.round(item.productId.price * item.quantity);
            if (item.isPreOrder) {
                totalPartialPayment += Math.round(item.partialPayment);
                totalBalancePayment += Math.round(itemTotal - item.partialPayment);
            } else {
                totalAmount += itemTotal;
            }
        });

        return {
            regularTotal: Math.round(totalAmount),
            partialPaymentTotal: Math.round(totalPartialPayment),
            balancePaymentTotal: Math.round(totalBalancePayment),
            grandTotal: Math.round(totalAmount + totalPartialPayment)
        };
    };

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

    if (!userId) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
                <div className="text-center p-8 rounded-lg shadow-md bg-white">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Please Login</h2>
                    <p className="text-gray-600 mb-6">You need to be logged in to access your cart</p>
                    <button
                        onClick={() => navigate('/login', { state: { from: '/cart' } })}
                        className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors duration-200"
                    >
                        Login
                    </button>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
                <div className="text-center p-8 rounded-lg shadow-md bg-white">
                    <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Cart is Empty</h2>
                    <p className="text-gray-600 mb-6">Add some items to your cart to continue shopping</p>
                    <Link to="/" className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors duration-200">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    const totals = calculateTotals();

    return (
        <>
            <section className="bg-white py-8 antialiased md:py-16">
                <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
                    <h2 className="text-xl font-semibold text-black sm:text-2xl">Shopping Cart</h2>

                    <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
                        <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
                            <div className="space-y-6">
                                {cartItems.map((item) => (
                                    <div key={item._id} className="rounded-lg bg-white p-4 shadow-sm md:p-6">
                                        <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                                            <div className="shrink-0 md:order-1">
                                                <img className="h-20 w-20" src={item.productId.image} alt={item.productId.name} />
                                            </div>

                                            <div className="flex items-center justify-between md:order-3 md:justify-end">
                                                <div className="flex items-center">
                                                    <button onClick={() => handleQuantityChange(item._id, -1)} className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-[#41444B] cursor-pointer">
                                                        <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 18 2">
                                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16" />
                                                        </svg>
                                                    </button>
                                                    <input
                                                        type="text"
                                                        className="w-10 shrink-0 border-0 bg-transparent text-center text-black"
                                                        value={item.quantity}
                                                        readOnly
                                                    />
                                                    <button onClick={() => handleQuantityChange(item._id, 1)} className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-[#41444B] cursor-pointer">
                                                        <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 18 18">
                                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                                <div className="text-end md:w-32">
                                                    <p className="text-base font-bold text-black">₹{Math.round(item.productId.price * item.quantity)}</p>
                                                </div>
                                            </div>

                                            <div className="w-full min-w-0 flex-1 md:order-2 md:max-w-md">
                                                <p className="text-base font-medium text-gray-900">{item.productId.name}</p>
                                                <div className="flex items-center gap-4 mt-4">
                                                    <button
                                                        onClick={() => handleRemoveItem(item._id)}
                                                        className="inline-flex items-center text-sm font-medium text-red-600 hover:underline"
                                                    >
                                                        <svg className="me-1.5 h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6" />
                                                        </svg>
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        {item.isPreOrder && (
                                            <div className="w-full bg-amber-50 p-2 rounded-md mt-2">
                                                <p className="text-amber-800 text-sm font-medium">Pre-order Item</p>
                                                <div className="flex justify-between text-sm">
                                                    <span>Partial Payment:</span>
                                                    <span>₹{Math.round(item.partialPayment)}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span>Balance Due:</span>
                                                    <span>₹{Math.round((item.productId.price * item.quantity) - item.partialPayment)}</span>
                                                </div>
                                                <div className="flex justify-between text-sm mt-1">
                                                    <span>Total Price:</span>
                                                    <span>₹{Math.round(item.productId.price * item.quantity)}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
                            <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
                                <p className="text-xl font-semibold text-black">Order summary</p>
                                <div className="space-y-4">
                                    {totals.regularTotal > 0 && (
                                        <dl className="flex items-center justify-between gap-4">
                                            <dt className="text-base font-normal text-gray-500">Regular Items Total</dt>
                                            <dd className="text-base font-medium text-gray-900">₹{totals.regularTotal}</dd>
                                        </dl>
                                    )}
                                    {totals.partialPaymentTotal > 0 && (
                                        <>
                                            <dl className="flex items-center justify-between gap-4">
                                                <dt className="text-base font-normal text-gray-500">Pre-order Partial Payment</dt>
                                                <dd className="text-base font-medium text-gray-900">₹{totals.partialPaymentTotal}</dd>
                                            </dl>
                                            <dl className="flex items-center justify-between gap-4">
                                                <dt className="text-base font-normal text-gray-500">Balance Payment Due</dt>
                                                <dd className="text-base font-medium text-amber-600">₹{totals.balancePaymentTotal}</dd>
                                            </dl>
                                        </>
                                    )}
                                    <dl className="flex items-center justify-between gap-4 border-t border-gray-500 pt-2">
                                        <dt className="text-base font-bold text-gray-900">Total Due Now</dt>
                                        <dd className="text-base font-bold text-gray-900">₹{totals.grandTotal}</dd>
                                    </dl>
                                </div>

                                <div
                                    onClick={() => navigate("/checkout")}  // Changed from setIsModalOpen(true)
                                    className="w-full rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-900"
                                >
                                    Proceed to Checkout
                                </div>

                                <div className="flex items-center justify-center gap-2">
                                    <span className="text-sm font-normal text-gray-500">or</span>
                                    <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-black underline hover:no-underline">
                                        Continue Shopping
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5m14 0-4 4m4-4-4-4" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Checkout Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-modal="true" role="dialog">
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm"
                        onClick={() => !isPlacingOrder && setIsModalOpen(false)}
                        style={{ backdropFilter: 'blur(4px)' }}>
                    </div>
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                            {/* Close button */}
                            {!isPlacingOrder && (
                                <div className="absolute right-0 top-0 pr-4 pt-4">
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                                    >
                                        <span className="sr-only">Close</span>
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            )}

                            {/* Rest of the modal content remains the same */}
                            <div className="sm:flex sm:items-start">
                                <div className="mt-3 w-full text-center sm:mt-0 sm:text-left"></div>
                                <h3 className="text-xl font-semibold leading-6 text-gray-900 mb-4">Complete Your Order</h3>
                                <div className="mt-2">
                                    <input
                                        type="tel"
                                        placeholder="Enter your phone number"
                                        className="w-full rounded-md border border-gray-300 px-4 py-2 text-black focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        maxLength="10"
                                    />
                                    <p className="mt-2 text-sm text-gray-500">Please enter your 10-digit phone number</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                            <button
                                type="button"
                                onClick={handleCheckout}
                                disabled={isPlacingOrder}
                                className="inline-flex w-full justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 sm:ml-3 sm:w-auto disabled:bg-gray-400"
                            >
                                {isPlacingOrder ? (
                                    <div className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Placing Order...
                                    </div>
                                ) : (
                                    'Place Order'
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                disabled={isPlacingOrder}
                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto disabled:bg-gray-100"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>

            )}
        </>
    );
};

export default Cart;