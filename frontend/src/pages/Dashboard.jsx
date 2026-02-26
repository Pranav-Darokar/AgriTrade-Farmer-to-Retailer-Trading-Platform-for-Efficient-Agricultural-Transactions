import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import OrderService from '../services/OrderService';
import { motion } from 'framer-motion';
import {
    Plus, ShoppingBag, List, TrendingUp, IndianRupee, Package,
    Calendar, Clock, User, ArrowRight, Loader2
} from 'lucide-react';

const STATUS_STYLES = {
    PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    CONFIRMED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    SHIPPED: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
    DELIVERED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
};

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const isFarmer = user?.roles?.some(role => role.includes('FARMER'));
    const isRetailer = user?.roles?.some(role => role.includes('RETAILER'));

    useEffect(() => {
        if (user) {
            fetchDashboardStats();
        }
    }, [user]);

    const fetchDashboardStats = async () => {
        try {
            const data = await OrderService.getDashboardStats();
            setStats(data);
        } catch (err) {
            console.error('Error fetching dashboard stats:', err);
            setError('Failed to load dashboard data.');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr) => {
        try {
            if (!dateStr) return 'N/A';
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return 'Invalid';
            return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        } catch { return 'N/A'; }
    };

    const formatTime = (dateStr) => {
        try {
            if (!dateStr) return '';
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return '';
            return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
        } catch { return ''; }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    const orderCount = stats?.orderCount || 0;
    const totalMoney = isFarmer ? (stats?.totalRevenue || 0) : (stats?.totalSpent || 0);
    const activeListings = stats?.activeListings || 0;
    const recentOrders = stats?.recentOrders || [];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Welcome back, <span className="text-green-600 dark:text-green-400">{user?.fullName?.split(' ')[0] || user?.username}</span>!
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    {isFarmer ? 'Manage your farm products and sales.' : 'Browse fresh produce and manage orders.'}
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="animate-spin h-10 w-10 text-green-500" />
                </div>
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-md mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border-l-4 border-green-500 transition-colors">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        {isFarmer ? 'Total Sales Revenue' : 'Total Amount Spent'}
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white flex items-center mt-1">
                                        <IndianRupee className="h-6 w-6" />
                                        {Number(totalMoney).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </p>
                                </div>
                                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                                    <IndianRupee className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border-l-4 border-blue-500 transition-colors">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        {isFarmer ? 'Total Orders Received' : 'Total Orders Placed'}
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{orderCount}</p>
                                </div>
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                                    <ShoppingBag className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                        </motion.div>

                        {isFarmer && (
                            <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border-l-4 border-purple-500 transition-colors">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Listings</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{activeListings}</p>
                                    </div>
                                    <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                                        <Package className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {isRetailer && (
                            <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border-l-4 border-purple-500 transition-colors">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Order Value</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white flex items-center mt-1">
                                            <IndianRupee className="h-5 w-5" />
                                            {orderCount > 0
                                                ? (Number(totalMoney) / orderCount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                                : '0.00'}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                                        <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Recent Orders Section */}
                    <motion.div variants={itemVariants} className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                                {isFarmer ? 'Recent Incoming Orders' : 'Recent Orders'}
                            </h2>
                            <Link
                                to={isFarmer ? '/farmer-orders' : '/my-orders'}
                                className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium flex items-center gap-1"
                            >
                                View All <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>

                        {recentOrders.length === 0 ? (
                            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
                                <Package className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
                                <h3 className="mt-3 text-base font-medium text-gray-700 dark:text-gray-300">No orders yet</h3>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    {isFarmer
                                        ? "You haven't received any orders yet. List products to start selling!"
                                        : "You haven't placed any orders yet. Browse the marketplace to get started!"}
                                </p>
                                <Link
                                    to={isFarmer ? '/add-product' : '/products'}
                                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    {isFarmer ? (
                                        <><Plus className="h-4 w-4" /> Add Product</>
                                    ) : (
                                        <><ShoppingBag className="h-4 w-4" /> Browse Marketplace</>
                                    )}
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentOrders.map((order) => (
                                    <div key={order.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all">
                                        {/* Order Header */}
                                        <div className="px-5 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700 flex flex-wrap items-center justify-between gap-3">
                                            <div className="flex items-center gap-4">
                                                <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                                                    Order #{order.id}
                                                </span>
                                                <div className="flex items-center text-gray-400 dark:text-gray-500 text-xs gap-1">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    {formatDate(order.orderDate)}
                                                </div>
                                                <div className="flex items-center text-gray-400 dark:text-gray-500 text-xs gap-1">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    {formatTime(order.orderDate)}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[order.status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                                                    {order.status}
                                                </span>
                                                <span className="text-base font-bold text-gray-900 dark:text-white flex items-center">
                                                    <IndianRupee className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                    {Number(order.totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Counterparty info */}
                                        {isFarmer && order.retailer && (
                                            <div className="px-5 py-2 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800/30 flex items-center gap-2 text-xs text-blue-700 dark:text-blue-300">
                                                <User className="h-3.5 w-3.5" />
                                                <span className="font-medium">
                                                    {order.retailer.fullName || order.retailer.email || 'Unknown Retailer'}
                                                </span>
                                                <span className="text-blue-300 dark:text-blue-600">|</span>
                                                📞 {order.retailer.mobileNumber || 'N/A'}
                                            </div>
                                        )}

                                        {/* Items */}
                                        <div className="px-5 py-3">
                                            <div className="flex flex-wrap gap-3">
                                                {order.items?.slice(0, 3).map((item) => (
                                                    <div key={item.id} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2">
                                                        <div className="h-8 w-8 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-600 flex items-center justify-center text-gray-400 dark:text-gray-500">
                                                            {item.product?.imageUrl ? (
                                                                <img
                                                                    src={item.product.imageUrl}
                                                                    alt={item.product?.name}
                                                                    className="w-full h-full object-cover"
                                                                    onError={(e) => {
                                                                        e.target.onerror = null;
                                                                        e.target.src = "https://via.placeholder.com/32x32?text=?";
                                                                    }}
                                                                />
                                                            ) : (
                                                                <Package className="h-4 w-4" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-medium text-gray-800 dark:text-gray-200">
                                                                {item.product?.name || 'Unknown'}
                                                            </p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                                                Qty: {item.quantity} × <IndianRupee className="h-2.5 w-2.5 mx-0.5" />{item.pricePerUnit}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                                {order.items?.length > 3 && (
                                                    <div className="flex items-center text-xs text-gray-400 dark:text-gray-500 font-medium px-2">
                                                        +{order.items.length - 3} more
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Quick Actions */}
                    <motion.div variants={itemVariants}>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {isFarmer && (
                                <>
                                    <Link to="/add-product" className="group flex items-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-700">
                                        <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg group-hover:bg-green-100 dark:group-hover:bg-green-900/50 transition-colors">
                                            <Plus className="h-6 w-6 text-green-600 dark:text-green-400" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-lg font-medium text-gray-900 dark:text-white">Add New Product</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">List your produce for sale</p>
                                        </div>
                                    </Link>
                                    <Link to="/my-products" className="group flex items-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-700">
                                        <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg group-hover:bg-green-100 dark:group-hover:bg-green-900/50 transition-colors">
                                            <List className="h-6 w-6 text-green-600 dark:text-green-400" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-lg font-medium text-gray-900 dark:text-white">My Listings</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Manage your current inventory</p>
                                        </div>
                                    </Link>
                                    <Link to="/farmer-orders" className="group flex items-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700 hover:border-orange-200 dark:hover:border-orange-700">
                                        <div className="p-3 bg-orange-50 dark:bg-orange-900/30 rounded-lg group-hover:bg-orange-100 dark:group-hover:bg-orange-900/50 transition-colors">
                                            <ShoppingBag className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-lg font-medium text-gray-900 dark:text-white">Incoming Orders</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Manage and fulfil retailer orders</p>
                                        </div>
                                    </Link>
                                </>
                            )}

                            {isRetailer && (
                                <>
                                    <Link to="/products" className="group flex items-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-700">
                                        <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                                            <ShoppingBag className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-lg font-medium text-gray-900 dark:text-white">Browse Marketplace</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Find fresh produce near you</p>
                                        </div>
                                    </Link>
                                    <Link to="/my-orders" className="group flex items-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-700">
                                        <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                                            <List className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-lg font-medium text-gray-900 dark:text-white">My Orders</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Track your purchases</p>
                                        </div>
                                    </Link>
                                </>
                            )}

                            {!isFarmer && !isRetailer && (
                                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 rounded-lg">
                                    No specific role detected. Please contact support.
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
};

export default Dashboard;
