import { useState, useEffect } from 'react';
import OrderService from '../services/OrderService';
import { useAuth } from '../context/AuthContext';
import {
    Package, Clock, Calendar, User, IndianRupee,
    ChevronDown, CheckCircle, Truck, BadgeCheck, AlertTriangle,
    Mail, Phone, MapPin, Search, Filter, ArrowRight, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_TRANSITIONS = {
    PENDING: ['CONFIRMED', 'CANCELLED'],
    CONFIRMED: ['SHIPPED'],
    SHIPPED: ['DELIVERED'],
    DELIVERED: [],
    CANCELLED: [],
};

const STATUS_STYLES = {
    PENDING: {
        bg: 'bg-amber-50 dark:bg-amber-900/20',
        text: 'text-amber-700 dark:text-amber-400',
        border: 'border-amber-100 dark:border-amber-800',
        label: 'Pending Approval',
        dot: 'bg-amber-500'
    },
    CONFIRMED: {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        text: 'text-blue-700 dark:text-blue-400',
        border: 'border-blue-100 dark:border-blue-800',
        label: 'Ready to Ship',
        dot: 'bg-blue-500'
    },
    SHIPPED: {
        bg: 'bg-indigo-50 dark:bg-indigo-900/20',
        text: 'text-indigo-700 dark:text-indigo-400',
        border: 'border-indigo-100 dark:border-indigo-800',
        label: 'In Transit',
        dot: 'bg-indigo-500'
    },
    DELIVERED: {
        bg: 'bg-emerald-50 dark:bg-emerald-900/20',
        text: 'text-emerald-700 dark:text-emerald-400',
        border: 'border-emerald-100 dark:border-emerald-800',
        label: 'Delivered',
        dot: 'bg-emerald-500'
    },
    CANCELLED: {
        bg: 'bg-rose-50 dark:bg-rose-900/20',
        text: 'text-rose-700 dark:text-rose-400',
        border: 'border-rose-100 dark:border-rose-800',
        label: 'Cancelled',
        dot: 'bg-rose-500'
    },
};

const FarmerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updatingId, setUpdatingId] = useState(null);
    const { user } = useAuth();
    const [filterStatus, setFilterStatus] = useState('ALL');

    useEffect(() => {
        if (user) fetchOrders();
    }, [user]);

    const fetchOrders = async () => {
        try {
            const data = await OrderService.getFarmerOrders();
            const sortedData = Array.isArray(data)
                ? data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
                : [];
            setOrders(sortedData);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError('Failed to load incoming orders.');
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
            return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
        } catch { return 'N/A'; }
    };

    const formatTime = (dateStr) => {
        try {
            if (!dateStr) return '';
            const d = new Date(dateStr);
            return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
        } catch { return ''; }
    };

    const filteredOrders = filterStatus === 'ALL'
        ? orders
        : orders.filter(o => o.status === filterStatus);

    if (loading) return (
        <div className="flex flex-col justify-center items-center min-h-[60vh]">
            <div className="relative h-20 w-20">
                <div className="absolute inset-0 rounded-full border-4 border-green-100 dark:border-green-900/30"></div>
                <div className="absolute inset-0 rounded-full border-4 border-green-500 border-t-transparent animate-spin"></div>
                <Package className="absolute inset-0 m-auto h-8 w-8 text-green-500" />
            </div>
            <p className="mt-4 text-gray-500 dark:text-gray-400 font-medium animate-pulse">Scanning for new orders...</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors">
            <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
                            <Truck className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white transition-colors">Order Management</h1>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 max-w-2xl">
                        Process and track incoming orders from retailers across the region.
                    </p>
                </div>

                <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-1.5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
                    {['ALL', 'PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${filterStatus === status
                                    ? 'bg-green-600 text-white shadow-lg shadow-green-600/20'
                                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                }`}
                        >
                            {status === 'ALL' ? 'Everything' : status}
                        </button>
                    ))}
                </div>
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

            {filteredOrders.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-24 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all"
                >
                    <div className="relative mx-auto h-32 w-32 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-full mb-6">
                        <FileText className="h-16 w-16 text-gray-300 dark:text-gray-600" />
                        <Search className="absolute bottom-4 right-4 h-8 w-8 text-green-500/50" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 uppercase tracking-tight">No match found</h3>
                    <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                        We couldn't find any orders with the status <span className="text-green-600 dark:text-green-400 font-bold">"{filterStatus}"</span>.
                    </p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 gap-8">
                    {filteredOrders.map((order, idx) => {
                        const style = STATUS_STYLES[order.status] || STATUS_STYLES.PENDING;
                        const nextStatuses = STATUS_TRANSITIONS[order.status] || [];

                        return (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="group bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:border-green-200 dark:hover:border-green-800/50 transition-all duration-300"
                            >
                                <div className="p-6 sm:p-8">
                                    <div className="flex flex-wrap items-center justify-between gap-6 mb-8 pb-6 border-b border-gray-50 dark:border-gray-700/50">
                                        <div className="flex items-center gap-4">
                                            <div className="h-14 w-14 bg-green-50 dark:bg-green-900/30 rounded-2xl flex items-center justify-center text-green-600 dark:text-green-400 ring-1 ring-green-100 dark:ring-green-900/50">
                                                <Package className="h-7 w-7" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-xl font-extrabold text-gray-900 dark:text-white transition-colors">Order #{order.id}</h3>
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${style.bg} ${style.text} ${style.border}`}>
                                                        {style.label}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="flex items-center"><Calendar className="h-4 w-4 mr-1 opacity-60" /> {formatDate(order.orderDate)}</span>
                                                    <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
                                                    <span className="flex items-center"><Clock className="h-4 w-4 mr-1 opacity-60" /> {formatTime(order.orderDate)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:items-end gap-3">
                                            <div className="text-3xl font-black text-gray-900 dark:text-white flex items-center transition-colors">
                                                <IndianRupee className="h-6 w-6 text-green-600 dark:text-green-400" />
                                                {order.totalAmount || 0}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {nextStatuses.map(status => {
                                                    const isLoading = updatingId === order.id;
                                                    const isCancel = status === 'CANCELLED';
                                                    return (
                                                        <button
                                                            key={status}
                                                            onClick={() => handleUpdateStatus(order.id, status)}
                                                            disabled={isLoading}
                                                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${isCancel
                                                                    ? 'text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/30 hover:bg-rose-50 dark:hover:bg-rose-900/20'
                                                                    : 'bg-green-600 dark:bg-green-700 text-white shadow-lg shadow-green-600/10 hover:bg-green-700 dark:hover:bg-green-600 hover:-translate-y-0.5'
                                                                } disabled:opacity-50`}
                                                        >
                                                            {isLoading ? (
                                                                <div className="animate-spin rounded-full h-3 w-3 border-2 border-current border-t-transparent" />
                                                            ) : isCancel ? null : <ArrowRight className="h-3 w-3" />}
                                                            {isCancel ? 'Reject Order' : `Mark as ${STATUS_STYLES[status]?.label || status}`}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                        <div className="lg:col-span-1 space-y-6">
                                            <div>
                                                <h4 className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-4">Retailer Contact</h4>
                                                <div className="bg-gray-50 dark:bg-gray-700/30 p-5 rounded-3xl border border-gray-100 dark:border-gray-700 space-y-4 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-12 w-12 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center text-green-600 dark:text-green-400 border border-gray-100 dark:border-gray-700 shadow-sm">
                                                            <User className="h-6 w-6" />
                                                        </div>
                                                        <div className="overflow-hidden">
                                                            <p className="text-base font-bold text-gray-900 dark:text-white truncate">
                                                                {order.retailer?.fullName || order.retailer?.username || 'Unknown Retailer'}
                                                            </p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                                                <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                                                                Verified Retailer
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-3 pt-2">
                                                        <a href={`tel:${order.retailer?.mobileNumber}`} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                                                            <div className="h-8 w-8 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
                                                                <Phone className="h-4 w-4" />
                                                            </div>
                                                            <span className="font-medium">{order.retailer?.mobileNumber || 'N/A'}</span>
                                                        </a>
                                                        <a href={`mailto:${order.retailer?.email}`} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                                                            <div className="h-8 w-8 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
                                                                <Mail className="h-4 w-4" />
                                                            </div>
                                                            <span className="font-medium truncate">{order.retailer?.email || 'N/A'}</span>
                                                        </a>
                                                        <div className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                                                            <div className="h-8 w-8 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                                                                <MapPin className="h-4 w-4" />
                                                            </div>
                                                            <span className="font-medium leading-relaxed">{order.retailer?.address || 'Pickup from Local Hub'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="lg:col-span-2">
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Product Inventory Items</h4>
                                                <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full border border-green-100 dark:border-green-800/50">
                                                    {order.items?.length || 0} ITEMS
                                                </span>
                                            </div>

                                            <div className="space-y-3">
                                                {order.items?.map((item) => (
                                                    <div key={item.id} className="group/item flex items-center justify-between bg-gray-50/50 dark:bg-gray-700/10 p-4 rounded-3xl border border-gray-50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800 transition-all hover:shadow-md ring-1 ring-transparent hover:ring-green-100 dark:hover:ring-green-900/30">
                                                        <div className="flex items-center gap-4">
                                                            <div className="h-16 w-16 flex-shrink-0 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500 border border-white dark:border-gray-800 shadow-sm transition-transform group-hover/item:scale-105">
                                                                {item.product?.imageUrl ? (
                                                                    <img
                                                                        src={item.product.imageUrl}
                                                                        alt={item.product?.name}
                                                                        className="w-full h-full object-cover"
                                                                        onError={(e) => {
                                                                            e.target.onerror = null;
                                                                            e.target.src = "https://via.placeholder.com/64x64?text=?";
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    <Package className="h-6 w-6" />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="text-base font-extrabold text-gray-900 dark:text-gray-100 transition-colors">
                                                                    {item.product?.name || 'Unknown Product'}
                                                                </p>
                                                                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5 font-medium">
                                                                    <IndianRupee className="h-3.5 w-3.5" />
                                                                    {item.pricePerUnit} <span className="text-[10px] text-gray-400">×</span> {item.quantity} {item.product?.unit || 'Unit'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-lg font-black text-gray-900 dark:text-white flex items-center justify-end">
                                                                <IndianRupee className="h-4 w-4 text-green-600 dark:text-green-500 mr-0.5" />
                                                                {(item.quantity * item.pricePerUnit).toFixed(2)}
                                                            </p>
                                                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">SUBTOTAL</p>
                                                        </div>
                                                    </div>
                                                )) || (
                                                        <div className="p-8 text-center text-sm text-gray-500 italic bg-gray-50 dark:bg-gray-700/20 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
                                                            No items associated with this record
                                                        </div>
                                                    )}
                                            </div>

                                            <div className="mt-8 flex justify-end">
                                                <div className="bg-green-600 dark:bg-green-700 rounded-2xl px-8 py-4 shadow-xl shadow-green-600/20 text-white flex items-center gap-10">
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-1">Grand Total</p>
                                                        <p className="text-2xl font-black flex items-center tracking-tight">
                                                            <IndianRupee className="h-6 w-6 mr-1" />
                                                            {order.totalAmount || 0}
                                                        </p>
                                                    </div>
                                                    <div className="h-10 w-px bg-white/20"></div>
                                                    <button className="flex items-center gap-2 font-bold text-sm tracking-wide group/print translate-y-0.5">
                                                        <FileText className="h-5 w-5 group-hover/print:scale-110 transition-transform" />
                                                        GENERATE INVOICE
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default FarmerOrders;

