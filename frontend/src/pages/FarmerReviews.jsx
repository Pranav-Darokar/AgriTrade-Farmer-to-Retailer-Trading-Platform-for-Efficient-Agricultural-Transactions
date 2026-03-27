import { useState, useEffect } from 'react';
import OrderService from '../services/OrderService';
import {
    Star, MessageSquare, Package, ClipboardList,
    ArrowRight, User, Calendar, IndianRupee
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FarmerReviews = () => {
    const [productReviews, setProductReviews] = useState([]);
    const [orderReviews, setOrderReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('products'); // 'products' or 'orders'

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const [pReviews, oReviews] = await Promise.all([
                OrderService.getFarmerProductReviews(),
                OrderService.getFarmerOrderReviews()
            ]);
            setProductReviews(pReviews);
            setOrderReviews(oReviews);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <header className="mb-10">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">My Feedback & Reviews</h1>
                <p className="text-gray-500 dark:text-gray-400">See what retailers are saying about your products and services.</p>
            </header>

            {/* Tabs */}
            <div className="flex space-x-1 bg-white dark:bg-gray-800 p-1.5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm mb-8 w-fit">
                <button
                    onClick={() => setActiveTab('products')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'products'
                            ? 'bg-green-600 text-white shadow-lg shadow-green-600/20'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                        }`}
                >
                    <Package size={18} />
                    Product Reviews
                </button>
                <button
                    onClick={() => setActiveTab('orders')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'orders'
                            ? 'bg-green-600 text-white shadow-lg shadow-green-600/20'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                        }`}
                >
                    <ClipboardList size={18} />
                    Order Feedback
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    {activeTab === 'products' ? (
                        /* Product Reviews List */
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {productReviews.length === 0 ? (
                                <div className="col-span-full py-20 text-center bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700">
                                    <MessageSquare className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                                    <p className="text-gray-500 dark:text-gray-400 font-medium">No product reviews yet.</p>
                                </div>
                            ) : (
                                productReviews.map((review) => (
                                    <div key={review.id} className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 bg-green-50 dark:bg-green-900/30 rounded-2xl flex items-center justify-center text-green-600 dark:text-green-400">
                                                    <Package size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1">{review.product?.name}</h3>
                                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                                        <Calendar size={12} /> {formatDate(review.createdAt)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg">
                                                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                                <span className="text-sm font-bold text-amber-700 dark:text-amber-400">{review.rating}</span>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-2xl mb-4">
                                            <p className="text-gray-700 dark:text-gray-200 text-sm italic">"{review.comment}"</p>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                            <User size={14} className="text-gray-400" />
                                            <span>Reviewed by <span className="font-bold text-gray-700 dark:text-gray-300">{review.user?.fullName}</span></span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    ) : (
                        /* Order Feedback List */
                        <div className="space-y-6">
                            {orderReviews.length === 0 ? (
                                <div className="py-20 text-center bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700">
                                    <ClipboardList className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                                    <p className="text-gray-500 dark:text-gray-400 font-medium">No order feedback yet.</p>
                                </div>
                            ) : (
                                orderReviews.map((review) => (
                                    <div key={review.id} className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6 pb-6 border-b border-gray-50 dark:border-gray-700">
                                            <div className="flex items-center gap-4">
                                                <div className="h-14 w-14 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                                                    <ClipboardList size={28} />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Order #{review.order?.id}</h3>
                                                    <div className="flex items-center gap-3 text-sm text-gray-500">
                                                        <span>{formatDate(review.createdAt)}</span>
                                                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                        <span className="flex items-center gap-1 font-bold text-green-600">
                                                            <IndianRupee size={14} /> {review.order?.totalAmount}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <div className="flex items-center gap-1 mb-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={20}
                                                            className={i < review.rating ? "text-amber-400 fill-amber-400" : "text-gray-200 dark:text-gray-700"}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Global Experience</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                            <div className="lg:col-span-2">
                                                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Retailer's Comment</h4>
                                                <div className="bg-blue-50/50 dark:bg-blue-900/10 p-6 rounded-3xl border border-blue-100/50 dark:border-blue-800/30">
                                                    <p className="text-gray-800 dark:text-gray-100 font-medium leading-relaxed italic">
                                                        "{review.comment}"
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="lg:col-span-1">
                                                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Retailer Details</h4>
                                                <div className="bg-gray-50 dark:bg-gray-700/30 p-5 rounded-2xl border border-gray-100 dark:border-gray-700">
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <div className="h-10 w-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-gray-500 border border-gray-100">
                                                            <User size={18} />
                                                        </div>
                                                        <p className="font-bold text-gray-900 dark:text-white">{review.user?.fullName}</p>
                                                    </div>
                                                    <p className="text-xs text-gray-500 ml-13">{review.user?.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
};

export default FarmerReviews;
