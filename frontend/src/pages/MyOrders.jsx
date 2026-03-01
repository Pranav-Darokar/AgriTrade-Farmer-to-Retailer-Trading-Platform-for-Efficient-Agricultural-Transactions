import { useState, useEffect } from 'react';
import OrderService from '../services/OrderService';
import { useAuth } from '../context/AuthContext';
import {
    Package, Clock, Calendar, User, IndianRupee, XCircle,
    AlertTriangle, ChevronRight, FileText, ShoppingBag,
    Truck, CheckCircle, MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cancellingId, setCancellingId] = useState(null);
    const [cancelling, setCancelling] = useState(false);
    const { user } = useAuth();

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
                // Sort by date - newest first
                setOrders(data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)));
            } else {
                setOrders([]);
            }
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError('Failed to load your orders.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async (orderId) => {
        setCancelling(true);
        try {
            const updatedOrder = await OrderService.cancelOrder(orderId);
            setOrders(prev =>
                prev.map(o => o.id === orderId ? updatedOrder : o)
            );
            setCancellingId(null);
        } catch (err) {
            console.error('Error cancelling order:', err);
            setError(err?.response?.data?.message || 'Failed to cancel order.');
            setCancellingId(null);
        } finally {
            setCancelling(false);
        }
    };

    const formatDate = (dateStr) => {
        try {
            if (!dateStr) return 'N/A';
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
        } catch (e) { return 'N/A'; }
    };

    const formatTime = (dateStr) => {
        try {
            if (!dateStr) return '';
            const date = new Date(dateStr);
            return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
        } catch (e) { return ''; }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'PENDING':
                return {
                    bg: 'bg-amber-50 dark:bg-amber-900/20',
                    text: 'text-amber-700 dark:text-amber-400',
                    border: 'border-amber-100 dark:border-amber-800',
                    icon: <Clock className="h-3 w-3 mr-1" />,
                    dot: 'bg-amber-500'
                };
            case 'CONFIRMED':
                return {
                    bg: 'bg-blue-50 dark:bg-blue-900/20',
                    text: 'text-blue-700 dark:text-blue-400',
                    border: 'border-blue-100 dark:border-blue-800',
                    icon: <CheckCircle className="h-3 w-3 mr-1" />,
                    dot: 'bg-blue-500'
                };
            case 'SHIPPED':
                return {
                    bg: 'bg-indigo-50 dark:bg-indigo-900/20',
                    text: 'text-indigo-700 dark:text-indigo-400',
                    border: 'border-indigo-100 dark:border-indigo-800',
                    icon: <Truck className="h-3 w-3 mr-1" />,
                    dot: 'bg-indigo-500'
                };
            case 'DELIVERED':
                return {
                    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
                    text: 'text-emerald-700 dark:text-emerald-400',
                    border: 'border-emerald-100 dark:border-emerald-800',
                    icon: <Package className="h-3 w-3 mr-1" />,
                    dot: 'bg-emerald-500'
                };
            case 'CANCELLED':
                return {
                    bg: 'bg-rose-50 dark:bg-rose-900/20',
                    text: 'text-rose-700 dark:text-rose-400',
                    border: 'border-rose-100 dark:border-rose-800',
                    icon: <XCircle className="h-3 w-3 mr-1" />,
                    dot: 'bg-rose-500'
                };
            default:
                return {
                    bg: 'bg-gray-50 dark:bg-gray-700/50',
                    text: 'text-gray-700 dark:text-gray-300',
                    border: 'border-gray-100 dark:border-gray-700',
                    icon: <AlertTriangle className="h-3 w-3 mr-1" />,
                    dot: 'bg-gray-400'
                };
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[60vh]">
                <div className="relative h-20 w-20">
                    <div className="absolute inset-0 rounded-full border-4 border-green-100 dark:border-green-900/30"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-green-500 border-t-transparent animate-spin"></div>
                    <ShoppingBag className="absolute inset-0 m-auto h-8 w-8 text-green-500" />
                </div>
                <p className="mt-4 text-gray-500 dark:text-gray-400 font-medium animate-pulse">Loading your orders...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors">
            <header className="mb-10">
                <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
                        <ShoppingBag className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white transition-colors">
                        {isFarmer ? 'Sales Orders' : 'Order History'}
                    </h1>
                </div>
                <p className="text-gray-500 dark:text-gray-400 max-w-2xl">
                    {isFarmer
                        ? "Manage orders received from retailers and track fulfillment status."
                        : "Track your active orders and review your complete purchase history."
                    }
                </p>
            </header>

            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 p-4 rounded-xl mb-8 flex items-center gap-3 border border-rose-100 dark:border-rose-800 shadow-sm transition-colors"
                >
                    <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                    <p className="font-medium">{error}</p>
                </motion.div>
            )}

            {!Array.isArray(orders) || orders.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-24 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all"
                >
                    <div className="relative mx-auto h-32 w-32 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-full mb-6">
                        <Package className="h-16 w-16 text-gray-300 dark:text-gray-600" />
                        <div className="absolute -top-1 -right-1 h-8 w-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold leading-none ring-4 ring-white dark:ring-gray-800">0</div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">No orders found</h3>
                    <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                        {isFarmer ? "Retailers haven't placed any orders with you yet." : "Ready to stock your inventory? Start browsing products today."}
                    </p>
                    {!isFarmer && (
                        <button
                            onClick={() => window.location.href = '/products'}
                            className="mt-8 px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-green-600/20 hover:-translate-y-0.5"
                        >
                            Open Marketplace
                        </button>
                    )}
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 gap-8">
                    {orders.map((order, idx) => {
                        const status = getStatusStyle(order.status);
                        return (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="group relative bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:border-green-200 dark:hover:border-green-800/50 transition-all duration-300"
                            >
                                {/* Glass Background Effect */}
                                <div className="absolute top-0 right-0 p-8 opacity-[0.03] dark:opacity-[0.1] -mr-8 -mt-8 pointer-events-none transition-transform group-hover:scale-110">
                                    <ShoppingBag className="h-64 w-64 text-green-500" />
                                </div>

                                <div className="p-6 sm:p-8 relative">
                                    <div className="flex flex-wrap items-center justify-between gap-6 mb-8">
                                        <div className="flex items-center gap-4">
                                            <div className="h-14 w-14 bg-green-50 dark:bg-green-900/30 rounded-2xl flex items-center justify-center text-green-600 dark:text-green-400 ring-1 ring-green-100 dark:ring-green-900/50">
                                                <FileText className="h-7 w-7" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">Order #{order.id}</h3>
                                                <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="flex items-center"><Calendar className="h-4 w-4 mr-1 opacity-60" /> {formatDate(order.orderDate)}</span>
                                                    <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
                                                    <span className="flex items-center"><Clock className="h-4 w-4 mr-1 opacity-60" /> {formatTime(order.orderDate)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:items-end gap-3">
                                            <div className="flex items-center gap-3">
                                                <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold ring-1 ring-inset ${status.bg} ${status.text} ${status.border} shadow-sm transition-colors`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${status.dot} mr-2 animate-pulse`}></span>
                                                    {order.status}
                                                </span>
                                                <div className="text-3xl font-black text-gray-900 dark:text-white flex items-center transition-colors">
                                                    <IndianRupee className="h-6 w-6 text-green-600 dark:text-green-500" />
                                                    {order.totalAmount || 0}
                                                </div>
                                            </div>

                                            {!isFarmer && order.status === 'PENDING' && (
                                                <AnimatePresence mode="wait">
                                                    {cancellingId === order.id ? (
                                                        <motion.div
                                                            key="confirm"
                                                            initial={{ opacity: 0, scale: 0.9 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            exit={{ opacity: 0 }}
                                                            className="flex items-center gap-2 p-1 bg-rose-50 dark:bg-rose-900/10 rounded-xl ring-1 ring-rose-200 dark:ring-rose-900/50"
                                                        >
                                                            <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400 uppercase tracking-widest pl-2">Cancel Order?</span>
                                                            <button
                                                                onClick={() => handleCancelOrder(order.id)}
                                                                disabled={cancelling}
                                                                className="px-4 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 transition-all disabled:opacity-50"
                                                            >
                                                                {cancelling ? '...' : 'Yes'}
                                                            </button>
                                                            <button
                                                                onClick={() => setCancellingId(null)}
                                                                disabled={cancelling}
                                                                className="px-4 py-1.5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-xs font-bold border border-gray-200 dark:border-gray-600 hover:bg-gray-50 transition-all"
                                                            >
                                                                No
                                                            </button>
                                                        </motion.div>
                                                    ) : (
                                                        <motion.button
                                                            key="btn"
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            onClick={() => setCancellingId(order.id)}
                                                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 border border-rose-200/50 dark:border-rose-900/30 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all group-hover:scale-105"
                                                        >
                                                            <XCircle className="h-4 w-4" />
                                                            Cancel Order
                                                        </motion.button>
                                                    )}
                                                </AnimatePresence>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col lg:flex-row gap-8">
                                        {/* Interaction Bar & Info */}
                                        <div className="w-full lg:w-72 flex-shrink-0 space-y-4">
                                            <div className="bg-gray-50 dark:bg-gray-700/30 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 transition-colors">
                                                <h4 className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-4">
                                                    {isFarmer ? 'Retailer Details' : 'Pickup From'}
                                                </h4>
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500 border border-gray-100 dark:border-gray-700">
                                                            <User className="h-5 w-5" />
                                                        </div>
                                                        <div className="overflow-hidden">
                                                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                                                {isFarmer
                                                                    ? (order.retailer?.fullName || order.retailer?.username || 'Unknown Retailer')
                                                                    : (order.items?.[0]?.product?.farmer?.fullName || 'Multiple Farmers')
                                                                }
                                                            </p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                                {isFarmer ? (order.retailer?.email || 'No email') : 'Verified Farmer'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                                        <MapPin className="h-4 w-4 text-green-500 flex-shrink-0" />
                                                        <span className="line-clamp-1 italic">
                                                            {isFarmer
                                                                ? (order.retailer?.address || 'Pickup from Hub')
                                                                : (order.items?.[0]?.product?.farmer?.address || 'Direct Shipping')
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Order Progress Visualization */}
                                            <div className="px-5">
                                                <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 dark:text-gray-600 mb-2">
                                                    <span>PROGRESS</span>
                                                    <span>{order.status === 'DELIVERED' ? '100%' : order.status === 'CANCELLED' ? '---' : 'PROCESSING'}</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-1000 ${order.status === 'CANCELLED' ? 'bg-rose-500 w-full' : 'bg-green-500'}`}
                                                        style={{
                                                            width: order.status === 'PENDING' ? '25%' :
                                                                order.status === 'CONFIRMED' ? '50%' :
                                                                    order.status === 'SHIPPED' ? '75%' : '100%'
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Items Grid */}
                                        <div className="flex-grow">
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Items In Order</h4>
                                                <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-md text-gray-500 dark:text-gray-400">{order.items?.length || 0} Products</span>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {order.items?.map((item) => (
                                                    <div key={item.id} className="flex items-center gap-4 bg-gray-50/50 dark:bg-gray-700/10 p-3 rounded-2xl border border-gray-50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800 transition-all ring-1 ring-transparent hover:ring-green-100 dark:hover:ring-green-900/30 group/item hover:shadow-sm">
                                                        <div className="h-16 w-16 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500 transition-colors shadow-sm">
                                                            {item.product?.imageUrl ? (
                                                                <img
                                                                    src={item.product.imageUrl}
                                                                    alt={item.product?.name}
                                                                    className="w-full h-full object-cover transition-transform group-hover/item:scale-110"
                                                                    onError={(e) => {
                                                                        e.target.onerror = null;
                                                                        e.target.src = "https://via.placeholder.com/64x64?text=?";
                                                                    }}
                                                                />
                                                            ) : (
                                                                <Package className="h-6 w-6" />
                                                            )}
                                                        </div>
                                                        <div className="overflow-hidden">
                                                            <p className="text-sm font-extrabold text-gray-900 dark:text-gray-100 truncate group-hover/item:text-green-600 dark:group-hover/item:text-green-400 transition-colors">
                                                                {item.product?.name || 'Unknown Product'}
                                                            </p>
                                                            <div className="flex items-center text-xs mt-1">
                                                                <span className="font-bold text-gray-500 dark:text-gray-400">{item.quantity} {item.product?.unit || 'Unit'}</span>
                                                                <span className="mx-2 text-gray-300 dark:text-gray-600">×</span>
                                                                <span className="flex items-center text-gray-900 dark:text-gray-100 font-medium">
                                                                    <IndianRupee className="h-3 w-3" />
                                                                    {item.pricePerUnit}
                                                                </span>
                                                            </div>
                                                            <div className="mt-1 text-[10px] font-black text-green-600 dark:text-green-400">
                                                                <IndianRupee className="h-2.5 w-2.5 inline mr-0.5" />
                                                                {(item.quantity * item.pricePerUnit).toFixed(2)} Total
                                                            </div>
                                                        </div>
                                                    </div>
                                                )) || <div className="text-sm text-gray-500 italic p-4">Empty order set</div>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700/20 px-8 py-4 flex justify-end transition-colors group-hover:bg-green-50/30 dark:group-hover:bg-green-900/10">
                                    <button className="text-xs font-bold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 flex items-center transition-all group-hover:translate-x-1">
                                        View Details <ChevronRight className="h-4 w-4 ml-1" />
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyOrders;

