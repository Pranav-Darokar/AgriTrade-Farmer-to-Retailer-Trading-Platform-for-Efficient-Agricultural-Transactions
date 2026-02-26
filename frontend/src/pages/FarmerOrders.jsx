import { useState, useEffect } from 'react';
import OrderService from '../services/OrderService';
import { useAuth } from '../context/AuthContext';
import {
    Package, Clock, Calendar, User, IndianRupee,
    ChevronDown, CheckCircle, Truck, BadgeCheck, AlertTriangle
} from 'lucide-react';

const STATUS_TRANSITIONS = {
    PENDING: ['CONFIRMED', 'CANCELLED'],
    CONFIRMED: ['SHIPPED'],
    SHIPPED: ['DELIVERED'],
    DELIVERED: [],
    CANCELLED: [],
};

const STATUS_STYLES = {
    PENDING: { badge: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300', label: 'Pending' },
    CONFIRMED: { badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300', label: 'Confirmed' },
    SHIPPED: { badge: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300', label: 'Shipped' },
    DELIVERED: { badge: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300', label: 'Delivered' },
    CANCELLED: { badge: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300', label: 'Cancelled' },
};

const FarmerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updatingId, setUpdatingId] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        if (user) fetchOrders();
    }, [user]);

    const fetchOrders = async () => {
        try {
            const data = await OrderService.getFarmerOrders();
            setOrders(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError('Failed to load orders.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        setUpdatingId(orderId);
        try {
            const updated = await OrderService.updateOrderStatus(orderId, newStatus);
            setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
        } catch (err) {
            console.error('Error updating status:', err);
            setError(err?.response?.data?.message || 'Failed to update order status.');
        } finally {
            setUpdatingId(null);
        }
    };

    const formatDate = (dateStr) => {
        try {
            if (!dateStr) return 'N/A';
            const d = new Date(dateStr);
            return isNaN(d.getTime()) ? 'Invalid Date' : d.toLocaleDateString();
        } catch { return 'N/A'; }
    };

    const formatTime = (dateStr) => {
        try {
            if (!dateStr) return '';
            const d = new Date(dateStr);
            return isNaN(d.getTime()) ? '' : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch { return ''; }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500" />
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">Incoming Orders</h1>
                <p className="mt-1 text-gray-500 dark:text-gray-400">Manage and fulfil orders from retailers for your products.</p>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-md mb-6 flex items-center gap-2 border border-red-100 dark:border-red-800 transition-colors">
                    <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                    {error}
                </div>
            )}

            {orders.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
                    <Package className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600" />
                    <h3 className="mt-4 text-lg font-semibold text-gray-800 dark:text-gray-200">No orders yet</h3>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">Retailers haven't placed any orders for your products yet.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => {
                        const style = STATUS_STYLES[order.status] || STATUS_STYLES.PENDING;
                        const nextStatuses = STATUS_TRANSITIONS[order.status] || [];

                        return (
                            <div key={order.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
                                <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-3 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 transition-colors">Order #{order.id}</span>
                                        <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm transition-colors">
                                            <Calendar className="h-4 w-4 mr-1" />
                                            {formatDate(order.orderDate)}
                                        </div>
                                        <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm transition-colors">
                                            <Clock className="h-4 w-4 mr-1" />
                                            {formatTime(order.orderDate)}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${style.badge} transition-colors`}>
                                            {style.label}
                                        </span>
                                        <div className="text-lg font-bold text-gray-900 dark:text-white flex items-center transition-colors">
                                            <IndianRupee className="h-4 w-4 text-green-600 dark:text-green-400" />
                                            {order.totalAmount || 0}
                                        </div>

                                        {nextStatuses.length > 0 && (
                                            <div className="relative flex items-center gap-1">
                                                {nextStatuses.map(status => {
                                                    const isLoading = updatingId === order.id;
                                                    const btnStyle = status === 'CANCELLED'
                                                        ? 'border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30'
                                                        : 'border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30';
                                                    const Icon = status === 'CONFIRMED' ? CheckCircle
                                                        : status === 'SHIPPED' ? Truck
                                                            : status === 'DELIVERED' ? BadgeCheck
                                                                : null;
                                                    return (
                                                        <button
                                                            key={status}
                                                            onClick={() => handleUpdateStatus(order.id, status)}
                                                            disabled={isLoading}
                                                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors disabled:opacity-60 ${btnStyle}`}
                                                        >
                                                            {isLoading ? (
                                                                <div className="animate-spin rounded-full h-3 w-3 border-t border-current" />
                                                            ) : Icon ? (
                                                                <Icon className="h-3.5 w-3.5" />
                                                            ) : null}
                                                            Mark as {STATUS_STYLES[status]?.label || status}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="px-6 py-2.5 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-900/30 flex flex-wrap items-center gap-4 text-sm text-blue-700 dark:text-blue-300 transition-colors">
                                    <div className="flex items-center gap-1.5">
                                        <User className="h-4 w-4" />
                                        <span className="font-medium">
                                            {order.retailer?.fullName || order.retailer?.email || 'Unknown Retailer'}
                                        </span>
                                    </div>
                                    <span className="text-blue-300 dark:text-blue-800">|</span>
                                    <span>📞 {order.retailer?.mobileNumber || 'N/A'}</span>
                                    {order.retailer?.email && (
                                        <>
                                            <span className="text-blue-300 dark:text-blue-800">|</span>
                                            <span>{order.retailer.email}</span>
                                        </>
                                    )}
                                </div>

                                <div className="px-6 py-4">
                                    <h4 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 transition-colors">Ordered Items</h4>
                                    <ul className="divide-y divide-gray-100 dark:divide-gray-700 transition-colors">
                                        {order.items?.map((item) => (
                                            <li key={item.id} className="py-3 flex justify-between items-center">
                                                <div className="flex items-center gap-3">
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
                                                    <div>
                                                        <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 transition-colors">
                                                            {item.product?.name || 'Unknown Product'}
                                                        </div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center transition-colors">
                                                            Qty: {item.quantity} ×
                                                            <IndianRupee className="h-3 w-3 inline" />
                                                            {item.pricePerUnit}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-sm font-semibold text-gray-900 dark:text-white flex items-center transition-colors">
                                                    <IndianRupee className="h-3 w-3" />
                                                    {(item.quantity * item.pricePerUnit).toFixed(2)}
                                                </div>
                                            </li>
                                        )) || (
                                                <li className="py-3 text-sm text-gray-500 dark:text-gray-400">No items in this order</li>
                                            )}
                                    </ul>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default FarmerOrders;
