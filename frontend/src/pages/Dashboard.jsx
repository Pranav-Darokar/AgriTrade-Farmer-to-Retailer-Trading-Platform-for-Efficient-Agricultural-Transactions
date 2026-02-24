import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Plus, ShoppingBag, List, TrendingUp, IndianRupee, Package } from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();

    // Check roles (adjust based on actual backend response format)
    const isFarmer = user?.roles?.some(role => role.includes('FARMER'));
    const isRetailer = user?.roles?.some(role => role.includes('RETAILER'));
    // If roles are just ["FARMER"] or ["ROLE_FARMER"]

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

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Welcome back, <span className="text-green-600">{user?.fullName?.split(' ')[0] || user?.username}</span>!
                </h1>
                <p className="mt-2 text-gray-600">
                    {isFarmer ? 'Manage your farm products and sales.' : 'Browse fresh produce and manage orders.'}
                </p>
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                {/* Stats Cards (Placeholders) */}
                <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total {isFarmer ? 'Sales' : 'Orders'}</p>
                            <p className="text-2xl font-bold text-gray-900 flex items-center">
                                <IndianRupee className="h-6 w-6" />
                                0.00
                            </p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-full">
                            <IndianRupee className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm font-medium text-gray-500">{isFarmer ? 'Active Listings' : 'Items Carted'}</p>
                            <p className="text-2xl font-bold text-gray-900">0</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full">
                            <Package className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Performance</p>
                            <p className="text-2xl font-bold text-gray-900">+0%</p>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-full">
                            <TrendingUp className="h-6 w-6 text-purple-600" />
                        </div>
                    </div>
                </motion.div>

                {/* Quick Actions */}
                <div className="col-span-1 md:col-span-2 lg:col-span-3 mt-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {isFarmer && (
                            <>
                                <Link to="/add-product" className="group flex items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-green-200">
                                    <div className="p-3 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                                        <Plus className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-lg font-medium text-gray-900">Add New Product</p>
                                        <p className="text-sm text-gray-500">List your produce for sale</p>
                                    </div>
                                </Link>
                                <Link to="/my-products" className="group flex items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-green-200">
                                    <div className="p-3 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                                        <List className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-lg font-medium text-gray-900">My Listings</p>
                                        <p className="text-sm text-gray-500">Manage your current inventory</p>
                                    </div>
                                </Link>
                                <Link to="/farmer-orders" className="group flex items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-orange-200">
                                    <div className="p-3 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors">
                                        <ShoppingBag className="h-6 w-6 text-orange-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-lg font-medium text-gray-900">Incoming Orders</p>
                                        <p className="text-sm text-gray-500">Manage and fulfil retailer orders</p>
                                    </div>
                                </Link>
                            </>
                        )}

                        {isRetailer && (
                            <>
                                <Link to="/products" className="group flex items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-green-200">
                                    <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                                        <ShoppingBag className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-lg font-medium text-gray-900">Browse Marketplace</p>
                                        <p className="text-sm text-gray-500">Find fresh produce near you</p>
                                    </div>
                                </Link>
                                <Link to="/my-orders" className="group flex items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-green-200">
                                    <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                                        <List className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-lg font-medium text-gray-900">My Orders</p>
                                        <p className="text-sm text-gray-500">Track your purchases</p>
                                    </div>
                                </Link>
                            </>
                        )}

                        {!isFarmer && !isRetailer && (
                            <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg">
                                No specific role detected. Please contact support.
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Dashboard;
