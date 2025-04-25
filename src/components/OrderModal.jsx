import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import SummaryApi from '../common/apiConfig';

const OrderModal = ({ isOpen, onClose, orderId, isAdmin, onStatusUpdate }) => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [trackingNumber, setTrackingNumber] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

    useEffect(() => {
        console.log('Modal props:', { isOpen, orderId }); // Debug log
        if (isOpen && orderId) {
            fetchOrderDetails();
        }
    }, [isOpen, orderId]);

    const fetchOrderDetails = async () => {
        console.log('Fetching order details for:', orderId); // Debug log
        setLoading(true);
        try {
            const response = await fetch(`${SummaryApi.getOrderDetails.url}${orderId}`, {
                method: SummaryApi.getOrderDetails.method,
                credentials: 'include',
            });
            const data = await response.json();
            if (data.success) {
                setOrder(data.data);
            } else {
                toast.error('Failed to fetch order details');
            }
        } catch (error) {
            console.error('Error fetching order:', error); // Debug log
            toast.error('Error fetching order details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (order) {
            setTrackingNumber(order.trackingNumber || '');
            setSelectedStatus(order.status);
        }
    }, [order]);

    const handleUpdateOrder = async () => {
        try {
            const response = await fetch(`${SummaryApi.updateOrder.url}${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    status: selectedStatus,
                    trackingNumber: trackingNumber
                })
            });
            const data = await response.json();
            if (data.success) {
                toast.success('Order updated successfully');
                setIsEditing(false);
                fetchOrderDetails();
                if (onStatusUpdate) onStatusUpdate(orderId, selectedStatus);
            } else {
                toast.error('Failed to update order');
            }
        } catch (error) {
            toast.error('Error updating order');
        }
    };

    if (!isOpen || !orderId) return null;

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8">
                    <p>Loading order details...</p>
                </div>
            </div>
        );
    }

    if (!order) return null;

    const orderStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="flex justify-between items-center p-6 bg-black">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-bold text-white">Order #{order._id}</h2>
                        <p className="text-amber-100 text-sm">
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-black cursor-pointer rounded-full transition-colors ml-auto">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 h-[calc(90vh-80px)]">
                    {/* Left Column - Order Items & Payment */}
                    <div className="p-6 overflow-y-auto">
                        {/* Order Items */}
                        <div className="space-y-4 mb-8">
                            <h3 className="text-xl font-bold text-gray-800">Order Items</h3>
                            {order.items.map((item, index) => (
                                <div key={index} className="flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200 hover:shadow-md transition-all">
                                    {/* Product Image */}
                                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-white border border-gray-200 flex-shrink-0">
                                        <img
                                            src={item.productId.image?.[0] || '/placeholder-jewelry.png'}
                                            alt={item.productId.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    {/* Product Details */}
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900">{item.productId.name}</h4>
                                        <div className="mt-1 space-y-1">
                                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                            <p className="text-sm text-gray-600">Price: ₹{item.price}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-black">₹{item.price * item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Payment Summary */}
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Payment Details</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between p-3 bg-white rounded-lg border border-gray-200">
                                    <span className="text-gray-600">Total Amount</span>
                                    <span className="font-bold text-black">₹{order.totalAmount}</span>
                                </div>
                                <div className="flex justify-between p-3 bg-white rounded-lg border border-green-200">
                                    <span className="text-gray-600">Paid Amount</span>
                                    <span className="font-bold text-green-600">₹{order.paidAmount}</span>
                                </div>
                                <div className="flex justify-between p-3 bg-white rounded-lg border border-gray-300">
                                    <span className="text-gray-800 font-medium">Balance Due</span>
                                    <span className="font-bold text-black">₹{order.balanceAmount}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Status & Customer Details */}
                    <div className="bg-gradient-to-br from-gray-50/50 to-gray-100/50 p-6 overflow-y-auto border-l border-gray-100">
                        {/* Status Section */}
                        <div className="bg-white rounded-xl p-6 mb-6 border border-gray-200">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold text-gray-800">Order Status</h3>
                                <span className={`px-4 py-1.5 rounded-full text-sm font-medium 
                                    ${order.status === 'delivered' ? 'bg-green-100 text-green-700 border border-green-200' :
                                        order.status === 'cancelled' ? 'bg-red-100 text-red-700 border border-red-200' :
                                            'bg-gray-100 text-black border border-gray-200'}`}>
                                    {order.status.toUpperCase()}
                                </span>
                            </div>

                            {isAdmin && (
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    {isEditing ? (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                                <select
                                                    value={selectedStatus}
                                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                                    className="w-full p-2.5 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                                >
                                                    {orderStatuses.map(status => (
                                                        <option
                                                            key={status}
                                                            value={status}
                                                            className="text-gray-900 bg-white"
                                                        >
                                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Tracking Number
                                                </label>
                                                <input
                                                    type="text"
                                                    value={trackingNumber}
                                                    onChange={(e) => setTrackingNumber(e.target.value)}
                                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                                                    placeholder="Enter tracking number"
                                                />
                                            </div>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={handleUpdateOrder}
                                                    className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all"
                                                >
                                                    Update Order
                                                </button>
                                                <button
                                                    onClick={() => setIsEditing(false)}
                                                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-all"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="w-full bg-gradient-to-r from-black to-gray-800 text-white px-4 py-2 rounded-lg hover:from-gray-900 hover:to-gray-700 transition-all"
                                        >
                                            Update Order Status
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Customer Information */}
                        <div className="bg-white rounded-xl p-6 border border-gray-200">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Customer Details</h3>
                            <div className="space-y-4">
                                <div className="p-3 bg-gray-50 rounded-lg flex border border-gray-200 justify-between">
                                    <div className="flex-1 ml-10 text-left">
                                        <p className="text-sm text-black mb-1">Name</p>
                                        <p className="font-medium text-gray-900">{order.userId?.name || 'Not Available'}</p>
                                    </div>
                                    <div className="flex-1 ml-10 text-left">
                                        <p className="text-sm text-black mb-1">Email</p>
                                        <p className="font-medium text-gray-900">{order.userId?.email || 'Not Available'}</p>
                                    </div>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg flex border border-gray-200 justify-between">
                                    <div className="flex-1 ml-10 text-left">
                                        <p className="text-sm text-black mb-1">Phone</p>
                                        <p className="font-medium text-gray-900">{order.contactPhone}</p>
                                    </div>
                                    <div className="flex-1 ml-10 text-left">
                                        <p className="text-sm text-black mb-1">Tracking Number</p>
                                        <p className="font-medium text-gray-900">{order.trackingNumber || 'Not Available'}</p>
                                    </div>
                                </div>
                                {order.transactionId && (
                                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <p className="text-sm text-black mb-1">Transaction ID</p>
                                        <p className="font-medium text-gray-900">{order.transactionId}</p>
                                    </div>
                                )}
                                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <p className="text-sm text-black mb-1">Delivery Address</p>
                                    <p className="font-medium text-gray-900">{order.shippingAddress}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderModal;
