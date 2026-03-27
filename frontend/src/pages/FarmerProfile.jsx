import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import OrderService from '../services/OrderService';
import {
    Star, MessageSquare, Package, ClipboardList,
    ArrowLeft, User, Calendar, MapPin, Mail, Phone,
    TrendingUp, ShieldCheck, ShoppingBag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FarmerProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [farmer, setFarmer] = useState(null);
    const [productReviews, setProductReviews] = useState([]);
    const [orderReviews, setOrderReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('products');

    useEffect(() => {
        if (id) {
            fetchFarmerData();
        }
    }, [id]);

    const fetchFarmerData = async () => {
        setLoading(true);
        try {
            const [profile, pReviews, oReviews] = await Promise.all([
                OrderService.getPublicFarmerProfile(id),
                OrderService.getPublicFarmerProductReviews(id),
                OrderService.getPublicFarmerOrderReviews(id)
            ]);
            setFarmer(profile);
            setProductReviews(pReviews || []);
            setOrderReviews(oReviews || []);
        } catch (error) {
            console.error('Error fetching farmer profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const averageRating = productReviews.length > 0
        ? (productReviews.reduce((acc, curr) => acc + curr.rating, 0) / productReviews.length).toFixed(1)
        : '0.0';

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    if (!farmer) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Farmer Profile Not Found</h2>
                <button
                    onClick={() => navigate('/products')}
                    className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition-colors"
                >
                    Back to Marketplace
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Header / Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-500 hover:text-green-600 transition-colors mb-8 group"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-bold uppercase tracking-widest text-xs">Back</span>
            </button>

            {/* Profile Info Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-xl shadow-green-900/5 border border-gray-100 dark:border-gray-700 overflow-hidden mb-12"
            >
                <div className="relative h-48 bg-gradient-to-r from-green-500 to-emerald-700">
                    <div className="absolute -bottom-16 left-10 p-2 bg-white dark:bg-gray-800 rounded-[2rem] shadow-xl border border-gray-50 dark:border-gray-700">
                        {farmer.profilePhoto ? (
                            <img
                                src={farmer.profilePhoto}
                                alt={farmer.fullName}
                                className="w-32 h-32 rounded-[1.5rem] object-cover"
                            />
                        ) : (
                            <div className="w-32 h-32 rounded-[1.5rem] bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                                <User size={48} />
                            </div>
                        )}
                        {farmer.status === 'APPROVED' && (
                            <div className="absolute -right-2 -bottom-2 bg-blue-500 text-white p-2 rounded-full border-4 border-white dark:border-gray-800 shadow-lg" title="Verified Farmer">
                                <ShieldCheck size={20} />
                            </div>
                        )}
                    </div>
                </div>

                <div className="pt-20 px-12 pb-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">{farmer.fullName}</h1>
                            <div className="flex flex-wrap items-center gap-6 text-gray-500 dark:text-gray-400 text-sm font-medium">
                                <span className="flex items-center gap-2">
                                    <MapPin size={16} className="text-green-500" />
                                    {farmer.address || 'Location Hidden'}
                                </span>
                                <span className="flex items-center gap-2">
                                    <Calendar size={16} className="text-green-500" />
                                    Member since {formatDate(farmer.createdAt)}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="bg-amber-50 dark:bg-amber-900/20 px-6 py-4 rounded-3xl border border-amber-100 dark:border-amber-800 text-center">
                                <div className="flex items-center gap-1 justify-center mb-1">
                                    <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                                    <span className="text-2xl font-black text-amber-700 dark:text-amber-400">{averageRating}</span>
                                </div>
                                <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Average Rating</p>
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-900/20 px-6 py-4 rounded-3xl border border-blue-100 dark:border-blue-800 text-center">
                                <div className="text-2xl font-black text-blue-700 dark:text-blue-400 mb-1">{productReviews.length + orderReviews.length}</div>
                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Total Reviews</p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Tabs & Content */}
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/3">
                    <div className="sticky top-8 space-y-4">
                        <button
                            onClick={() => setActiveTab('products')}
                            className={`w-full flex items-center justify-between p-6 rounded-3xl border transition-all duration-300 ${activeTab === 'products'
                                ? 'bg-green-600 border-green-600 text-white shadow-xl shadow-green-600/20 -translate-y-1'
                                : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-green-500'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <Package size={24} />
                                <div className="text-left">
                                    <p className="font-black text-sm uppercase tracking-widest leading-none mb-1">Product Reviews</p>
                                    <p className={`text-xs ${activeTab === 'products' ? 'text-green-100' : 'text-gray-400'}`}>{productReviews.length} Verified Reviews</p>
                                </div>
                            </div>
                        </button>

                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`w-full flex items-center justify-between p-6 rounded-3xl border transition-all duration-300 ${activeTab === 'orders'
                                ? 'bg-green-600 border-green-600 text-white shadow-xl shadow-green-600/20 -translate-y-1'
                                : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-green-500'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <ClipboardList size={24} />
                                <div className="text-left">
                                    <p className="font-black text-sm uppercase tracking-widest leading-none mb-1">Order Feedback</p>
                                    <p className={`text-xs ${activeTab === 'orders' ? 'text-green-100' : 'text-gray-400'}`}>{orderReviews.length} Global Responses</p>
                                </div>
                            </div>
                        </button>

                        <div className="p-8 bg-gray-50 dark:bg-gray-800/40 rounded-[2rem] border border-gray-100 dark:border-gray-700 space-y-6">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Connect with Farmer</h3>
                            <div className="space-y-4">
                                <a href={`mailto:${farmer.email}`} className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 hover:text-green-600 transition-colors">
                                    <div className="h-10 w-10 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-700">
                                        <Mail size={18} />
                                    </div>
                                    <span className="font-medium truncate">{farmer.email}</span>
                                </a>
                                {farmer.mobileNumber && (
                                    <a href={`tel:${farmer.mobileNumber}`} className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 hover:text-green-600 transition-colors">
                                        <div className="h-10 w-10 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-700">
                                            <Phone size={18} />
                                        </div>
                                        <span className="font-medium">{farmer.mobileNumber}</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:w-2/3">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {activeTab === 'products' ? (
                                <div className="grid grid-cols-1 gap-6">
                                    {productReviews.length === 0 ? (
                                        <div className="py-20 text-center bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700">
                                            <MessageSquare className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                                            <p className="text-gray-500 dark:text-gray-400 font-medium">No reviews found for this farmer's products.</p>
                                        </div>
                                    ) : (
                                        productReviews.map((review) => (
                                            <div key={review.id} className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300 group">
                                                <div className="flex items-start justify-between mb-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-14 w-14 bg-green-50 dark:bg-green-900/30 rounded-2xl flex items-center justify-center text-green-600 dark:text-green-400 shadow-sm transition-transform group-hover:scale-105">
                                                            <Package size={28} />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{review.product?.name}</h3>
                                                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                                                <Calendar size={12} /> {formatDate(review.createdAt)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-xl border border-amber-100 dark:border-amber-900/40">
                                                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                                        <span className="text-lg font-black text-amber-700 dark:text-amber-400">{review.rating}</span>
                                                    </div>
                                                </div>
                                                <div className="bg-gray-50 dark:bg-gray-700/30 p-6 rounded-[1.5rem] border border-gray-100 dark:border-gray-700 mb-6">
                                                    <p className="text-gray-700 dark:text-gray-200 leading-relaxed italic">"{review.comment}"</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-green-600 dark:text-green-400 text-xs font-bold">
                                                        {review.user?.fullName?.charAt(0) || 'R'}
                                                    </div>
                                                    <span className="text-sm">Verified Buyer: <span className="font-bold text-gray-900 dark:text-white">{review.user?.fullName}</span></span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {orderReviews.length === 0 ? (
                                        <div className="py-20 text-center bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700">
                                            <ClipboardList className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                                            <p className="text-gray-500 dark:text-gray-400 font-medium">No order feedback yet for this farmer.</p>
                                        </div>
                                    ) : (
                                        orderReviews.map((review) => (
                                            <div key={review.id} className="bg-white dark:bg-gray-800 p-10 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-8 border-b border-gray-50 dark:border-gray-700">
                                                    <div className="flex items-center gap-5">
                                                        <div className="h-16 w-16 bg-blue-50 dark:bg-blue-900/30 rounded-3xl flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-inner">
                                                            <ShoppingBag size={32} />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-2xl font-black text-gray-900 dark:text-white">Order Feedback</h3>
                                                            <div className="flex items-center gap-3 text-sm text-gray-500">
                                                                <span>{formatDate(review.createdAt)}</span>
                                                                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                                                                <span className="text-xs uppercase tracking-widest font-bold text-gray-400">Transaction Complete</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-2">
                                                        <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/20 px-4 py-2 rounded-2xl border border-amber-100 dark:border-amber-800">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    size={20}
                                                                    className={i < review.rating ? "text-amber-500 fill-amber-500" : "text-gray-200 dark:text-gray-700"}
                                                                />
                                                            ))}
                                                        </div>
                                                        <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em]">Overall Service</p>
                                                    </div>
                                                </div>

                                                <div className="bg-blue-50/30 dark:bg-blue-900/10 p-8 rounded-[2rem] border border-blue-100/30 dark:border-blue-800/20 relative">
                                                    <p className="text-lg text-gray-800 dark:text-gray-100 font-medium leading-relaxed italic relative z-10">
                                                        "{review.comment}"
                                                    </p>
                                                    <div className="absolute top-4 right-8 text-6xl text-blue-100 dark:text-blue-900/20 font-serif opacity-50">"</div>
                                                </div>

                                                <div className="mt-8 flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-12 w-12 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center text-gray-400 border border-gray-100 dark:border-gray-700 shadow-sm">
                                                            <User size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-900 dark:text-white">{review.user?.fullName}</p>
                                                            <p className="text-xs text-gray-500">Retailer Member</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-xl text-green-600 dark:text-green-400 text-[10px] font-black uppercase tracking-widest border border-green-100 dark:border-green-800">
                                                        <ShieldCheck size={14} /> Verified Transaction
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default FarmerProfile;
