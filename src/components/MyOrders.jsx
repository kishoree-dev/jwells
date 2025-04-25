import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaEye } from 'react-icons/fa';
import SummaryApi from '../common/apiConfig';
import OrderModal from './OrderModal';

const MyOrders = () => {

    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [paymentFilter, setPaymentFilter] = useState('all');
    const [deliveryFilter, setDeliveryFilter] = useState('all');
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await fetch(SummaryApi.getMyOrders.url, {
                method: SummaryApi.getMyOrders.method,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ userId }) // Just pass userId directly
            });
            const data = await response.json();
            if (data.success) {
                setOrders(data.data);
            } else {
                toast.error(data.message || 'Failed to fetch orders');
            }
        } catch (error) {
            toast.error('Failed to fetch orders');
            console.error(error);
        }
    };

    // Add search filter function
    const filteredOrders = orders.filter(order =>
        (order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.paymentStatus.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (paymentFilter === 'all' || order.paymentStatus === paymentFilter) &&
        (deliveryFilter === 'all' || order.status === deliveryFilter)
    );

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-3xl font-bold mb-6 flex items-center justify-between text-gray-900">
                <span>My Orders</span>
                <span className="text-sm ml-10 text-gray-500">Total Orders: {orders.length}</span>
            </h2>

            {/* Simplified Search and Filters UI */}
            <div className="mb-6 bg-gray-100 p-3 rounded-lg flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-3 flex-1">
                    <select
                        className="text-gray-900 font-medium bg-white px-4 py-2 rounded-full 
                        border-2 border-blue-200 hover:border-blue-400 focus:border-blue-500 
                        focus:ring-0 text-sm min-w-[130px] shadow-sm"
                        value={paymentFilter}
                        onChange={(e) => setPaymentFilter(e.target.value)}
                    >
                        <option value="all">💳 All Payments</option>
                        <option value="Paid">✅ Paid</option>
                        <option value="Cash on Delivery">💰 COD</option>
                        <option value="Pending">⏳ Pending</option>
                    </select>

                    <select
                        className="text-gray-900 font-medium bg-white px-4 py-2 rounded-full 
                        border-2 border-purple-200 hover:border-purple-400 focus:border-purple-500 
                        focus:ring-0 text-sm min-w-[130px] shadow-sm"
                        value={deliveryFilter}
                        onChange={(e) => setDeliveryFilter(e.target.value)}
                    >
                        <option value="all">📦 All Status</option>
                        <option value="pending">⌛ Pending</option>
                        <option value="processing">🔄 Processing</option>
                        <option value="shipped">🚚 Shipped</option>
                        <option value="delivered">✅ Delivered</option>
                        <option value="cancelled">❌ Cancelled</option>
                    </select>
                </div>

                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search in orders..."
                        className="w-64 pl-10 pr-4 py-2 rounded-full bg-white text-gray-900 
                        font-medium border-2 border-gray-200 hover:border-gray-400 
                        focus:border-gray-500 focus:ring-0 text-sm shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="absolute left-3 top-2.5 text-gray-500">
                        🔍
                    </span>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 tracking-wider">Order ID</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 tracking-wider">Date</th>
                                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-800 tracking-wider">Status</th>
                                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-800 tracking-wider">Payment Status</th>
                                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-800 tracking-wider">Total</th>
                                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-800 tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredOrders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                        {order._id.slice(-8)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' :
                                                order.paymentStatus === 'Cash on Delivery' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-yellow-100 text-yellow-800'}`}>
                                            {order.paymentStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-right">
                                        ₹{order.totalAmount}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <button
                                            onClick={() => {
                                                setSelectedOrder(order._id);
                                                setIsModalOpen(true);
                                            }}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            <FaEye className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Show empty state if no filtered orders */}
            {filteredOrders.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500">No orders found</p>
                </div>
            )}

            {/* Order Modal */}
            <OrderModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedOrder(null);
                }}
                orderId={selectedOrder}
                isAdmin={false}
            />
        </div>
    );
};

export default MyOrders;
