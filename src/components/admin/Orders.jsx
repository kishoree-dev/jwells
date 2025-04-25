import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaEye } from 'react-icons/fa';
import SummaryApi from '../../common/apiConfig';
import OrderModal from '../OrderModal';
import LoadingModal from '../LoadingModal';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [paymentFilter, setPaymentFilter] = useState('all');
    const [deliveryFilter, setDeliveryFilter] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const ordersPerPage = 10;

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(SummaryApi.getAllOrders.url, {
                method: SummaryApi.getAllOrders.method,
                credentials: 'include',
            });
            const data = await response.json();
            if (data.success) {
                setOrders(data.data);
            }
        } catch (error) {
            toast.error('Failed to fetch orders');
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, status) => {
        try {
            const response = await fetch(`${SummaryApi.updateOrder.url}${orderId}`, {
                method: SummaryApi.updateOrder.method,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ status }),
            });
            const data = await response.json();
            if (data.success) {
                toast.success('Order status updated successfully');
                fetchOrders();
            }
        } catch (error) {
            toast.error('Failed to update order status');
        }
    };

    const filteredOrders = orders.filter(order =>
        (order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.userId.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.paymentStatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (order.trackingNumber && order.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()))) &&
        (paymentFilter === 'all' || order.paymentStatus === paymentFilter) &&
        (deliveryFilter === 'all' || order.status === deliveryFilter)
    );

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

    return (
        <>
            {isLoading && <LoadingModal />}
            <div className="p-6 max-w-8xl mx-auto bg-transparent">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Orders Management</h1>
                    <span className="text-sm text-gray-500 ml-10">Total Orders: {orders.length}</span>
                </div>

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

                <div className="bg-white/30 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-200/50">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 tracking-wider">Order ID</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-800 tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-800 tracking-wider">Payment Status</th>
                                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-800 tracking-wider">Tracking #</th>
                                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-800 tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {currentOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{order._id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{order.userId.email}</td>
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
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-center">
                                            {order.trackingNumber || 'N/A'}
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

                {/* Updated Pagination */}
                <div className="flex justify-end mt-4 space-x-2">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border rounded-md disabled:opacity-50 bg-gray-50 hover:bg-gray-100 text-gray-700"
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2 text-gray-700">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border rounded-md disabled:opacity-50 bg-gray-50 hover:bg-gray-100 text-gray-700"
                    >
                        Next
                    </button>
                </div>

                <OrderModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedOrder(null);
                    }}
                    orderId={selectedOrder}
                    isAdmin={true}
                    onStatusUpdate={handleStatusUpdate}
                />
            </div >
        </>

    );
};

export default Orders;
