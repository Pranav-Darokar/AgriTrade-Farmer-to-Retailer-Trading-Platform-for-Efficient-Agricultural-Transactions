import { useState, useEffect } from 'react';
import OrderService from '../services/OrderService';
import { useAuth } from '../context/AuthContext';
import { Package, Clock, Calendar, User, IndianRupee, XCircle, AlertTriangle } from 'lucide-react';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cancellingId, setCancellingId] = useState(null); // ID of order being confirmed for cancel
    const [cancelling, setCancelling] = useState(false);   // loading state for cancel request
    const { user } = useAuth();

    // Robust role checking
    const isFarmer = user?.roles?.some(role => role.includes('FARMER'));

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            const data = isFarmer
                ? await OrderService.getFarmerOrders()
                : await OrderService.getMyOrders();

            if (Array.isArray(data)) {
                setOrders(data);
            } else {
                console.error('Expected array of orders, got:', data);
                setOrders([]);
            }
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError('Failed to load orders.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async (orderId) => {
        setCancelling(true);
        try {
            const updatedOrder = await OrderService.cancelOrder(orderId);
            // Update the order in list with the returned cancelled order
            setOrders(prev =>
                prev.map(o => o.id === orderId ? updatedOrder : o)
            );
            setCancellingId(null);
        } catch (err) {
            console.error('Error cancelling order:', err);
            setError(err?.response?.data?.message || 'Failed to cancel order. Please try again.');
            setCancellingId(null);
        } finally {
            setCancelling(false);
        }
    };

    const formatDate = (dateStr) => {
        try {
            if (!dateStr) return 'N/A';
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return 'Invalid Date';
            return date.toLocaleDateString();
        } catch (e) {
            return 'N/A';
        }
    };

    const formatTime = (dateStr) => {
        try {
            if (!dateStr) return '';
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return '';
            return date.toLocaleTimeString();
        } catch (e) {
            return '';
        }
    };

    const statusBadge = (status) => {
        const styles = {
            PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
            COMPLETED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
            CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
        };
        return styles[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 transition-colors">
                {isFarmer ? 'Incoming Orders' : 'My Orders'}
            </h1>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-md mb-6 flex items-center gap-2 border border-red-100 dark:border-red-800 transition-colors">
                    <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                    {error}
                </div>
            )}

            {!Array.isArray(orders) || orders.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
                    <Package className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-200">No orders found</h3>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">
                        {isFarmer ? "You haven't received any orders yet." : "You haven't placed any orders yet."}
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
                            {/* Order Header */}
                            <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-4 transition-colors">
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center text-gray-500 dark:text-gray-400 transition-colors">
                                        <Calendar className="h-5 w-5 mr-2" />
                                        <span className="text-sm font-medium">{formatDate(order.orderDate)}</span>
                                    </div>
                                    <div className="flex items-center text-gray-500 dark:text-gray-400 transition-colors">
                                        <Clock className="h-5 w-5 mr-2" />
                                        <span className="text-sm font-medium">{formatTime(order.orderDate)}</span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 flex-wrap gap-2">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge(order.status)} transition-colors`}>
                                        {order.status}
                                    </span>
                                    <div className="text-lg font-bold text-gray-900 dark:text-white flex items-center transition-colors">
                                        <IndianRupee className="h-5 w-5 text-green-600 dark:text-green-400" />
                                        {order.totalAmount || 0}
                                    </div>

                                    {/* Cancel button only for retailers on PENDING orders */}
                                    {!isFarmer && order.status === 'PENDING' && (
                                        cancellingId === order.id ? (
                                            <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2 transition-colors">
                                                <span className="text-xs text-red-700 dark:text-red-400 font-medium">Cancel this order?</span>
                                                <button
                                                    onClick={() => handleCancelOrder(order.id)}
                                                    disabled={cancelling}
                                                    className="text-xs bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-600 text-white px-2 py-1 rounded font-medium transition-all disabled:opacity-60"
                                                >
                                                    {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
                                                </button>
                                                <button
                                                    onClick={() => setCancellingId(null)}
                                                    disabled={cancelling}
                                                    className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 font-medium transition-all"
                                                >
                                                    No
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setCancellingId(order.id)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all"
                                            >
                                                <XCircle className="h-4 w-4" />
                                                Cancel Order
                                            </button>
                                        )
                                    )}
                                </div>
                            </div>

                            {/* Farmer info (for farmer view) */}
                            {isFarmer && (
                                <div className="px-6 py-2 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-900/30 flex items-center text-sm text-blue-700 dark:text-blue-300 transition-colors">
                                    <User className="h-4 w-4 mr-2" />
                                    Ordered by: {order.retailer?.fullName || order.retailer?.email || 'Unknown Retailer'}
                                    <span className="mx-2 text-blue-300 dark:text-blue-800">|</span>
                                    Contact: {order.retailer?.mobileNumber || 'N/A'}
                                </div>
                            )}

                            {/* Items list */}
                            <div className="px-6 py-4">
                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 transition-colors">Items</h4>
                                <ul className="divide-y divide-gray-200 dark:divide-gray-700 transition-colors">
                                    {order.items?.map((item) => (
                                        <li key={item.id} className="py-3 flex justify-between items-center">
                                            <div className="flex items-center">
                                                <div className="h-12 w-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500 transition-colors">
                                                    {item.product?.imageUrl ? (
                                                        <img
                                                            src={item.product.imageUrl}
                                                            alt={item.product?.name}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = "https://via.placeholder.com/48x48?text=?";
                                                            }}
                                                        />
                                                    ) : (
                                                        <Package className="h-5 w-5" />
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100 transition-colors">{item.product?.name || 'Unknown Product'}</div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center transition-colors">
                                                        Qty: {item.quantity} x <IndianRupee className="h-3 w-3 inline mx-0.5" />{item.pricePerUnit}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center transition-colors">
                                                <IndianRupee className="h-3 w-3" />
                                                {(item.quantity * item.pricePerUnit).toFixed(2)}
                                            </div>
                                        </li>
                                    )) || <li className="py-3 text-sm text-gray-500 dark:text-gray-400">No items in this order</li>}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrders;
