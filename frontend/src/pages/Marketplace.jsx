import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, Search, Filter, Loader2, IndianRupee, Package, Info, Check, X, Star, MessageSquare, Sprout, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Marketplace = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [sortBy, setSortBy] = useState('newest'); // 'price-low', 'price-high', 'category-az', 'newest'
    const [error, setError] = useState('');
    const { addToCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [addedItems, setAddedItems] = useState({});
    const [selectedProductReviews, setSelectedProductReviews] = useState(null); // {productId, reviews: []}
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);



    const handleBuyNow = (product) => {
        addToCart(product);
        navigate('/cart');
    };

    useEffect(() => {
        fetchProducts();
        // Poll for updates every 30 seconds to simulate real-time stock changes
        const interval = setInterval(fetchProducts, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchProducts = async () => {
        try {
            // Public endpoint
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/public/products`);
            setProducts(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            console.error(err);
            setError('Failed to load marketplace products.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = (product) => {
        addToCart(product);
        setAddedItems(prev => ({ ...prev, [product.id]: true }));
        setTimeout(() => {
            setAddedItems(prev => ({ ...prev, [product.id]: false }));
        }, 2000);
    };

    const fetchReviews = async (productId) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/public/products/${productId}/reviews`);
            setSelectedProductReviews({ productId, reviews: response.data });
        } catch (err) {
            console.error("Error fetching reviews:", err);
        }
    };

    const handleSubmitReview = async (productId) => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (!reviewForm.comment.trim()) return;

        setIsSubmittingReview(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/retailer/products/${productId}/reviews`, reviewForm, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setReviewForm({ rating: 5, comment: '' });
            fetchReviews(productId);
        } catch (err) {
            console.error("Error submitting review:", err);
            alert("Failed to submit review. Only retailers can review products.");
        } finally {
            setIsSubmittingReview(false);
        }
    };


    // Generate categories dynamically from products
    const categories = ['All', ...new Set(products
        .map(p => p.category)
        .filter(cat => cat && cat.trim() !== '')
    )].sort();

    const filteredProducts = products.filter(product => {
        const name = product.name || '';
        const desc = product.description || '';
        const category = product.category || '';
        const priceValue = Number(product.price) || 0;

        const matchesSearch = name.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
            desc.toLowerCase().includes(searchTerm.trim().toLowerCase());

        const matchesCategory = categoryFilter === 'All' ||
            category.trim().toLowerCase() === categoryFilter.trim().toLowerCase();

        return matchesSearch && matchesCategory;
    }).sort((a, b) => {
        const priceA = Number(a.price) || 0;
        const priceB = Number(b.price) || 0;

        if (sortBy === 'price-low') return priceA - priceB;
        if (sortBy === 'price-high') return priceB - priceA;
        if (sortBy === 'category-az') return (a.category || '').localeCompare(b.category || '');
        return Number(b.id) - Number(a.id);
    });

    const resetFilters = () => {
        setSearchTerm('');
        setCategoryFilter('All');
        setSortBy('newest');
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

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Marketplace</h1>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">Fresh produce directly from farmers.</p>
                </div>

                <div className="relative w-full md:w-96">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-colors"
                        placeholder="Search for products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Filter Section */}
            {!loading && products.length > 0 && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8 space-y-6 transition-colors">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-green-600 dark:text-green-400" />
                            <span className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Categories</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setCategoryFilter(cat)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${categoryFilter === cat
                                        ? 'bg-green-600 text-white border-green-600 shadow-md'
                                        : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-green-500 hover:text-green-600 dark:hover:text-green-400'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-8 pt-6 border-t border-gray-100 dark:border-gray-700">

                        {/* Sorting */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold">Sort By</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="text-sm border-gray-200 dark:border-gray-600 rounded-lg focus:ring-green-500 focus:border-green-500 p-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 min-w-[160px] transition-colors"
                            >
                                <option value="newest">Newest First</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="category-az">Category: A-Z</option>
                            </select>
                        </div>

                        {/* Reset Button */}
                        <div className="flex items-end flex-grow">
                            {(searchTerm || categoryFilter !== 'All' || sortBy !== 'newest') && (
                                <button
                                    onClick={resetFilters}
                                    className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-bold flex items-center gap-1 transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                    Clear all filters
                                </button>
                            )}
                            <div className="ml-auto text-sm text-gray-500 dark:text-gray-400">
                                Showing <span className="font-bold text-gray-900 dark:text-white">{filteredProducts.length}</span> products
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center min-h-[40vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                </div>
            ) : error ? (
                <div className="text-center text-red-600 dark:text-red-400 py-10">{error}</div>
            ) : filteredProducts.length === 0 ? (
                <div className="text-center py-16">
                    <Package className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No products found</h3>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">Try adjusting your search terms or check back later.</p>
                </div>
            ) : (
                <motion.div
                    layout
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                >
                    <AnimatePresence mode='popLayout'>
                        {filteredProducts.map((product) => (
                            <motion.div
                                layout
                                key={product.id}
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                className={`group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-black/30 transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col ${product.quantity <= 0 ? 'opacity-80' : ''}`}
                            >
                                <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
                                    {product.imageUrl ? (
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className={`w-full h-full object-cover ${product.quantity <= 0 ? 'grayscale' : ''}`}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-green-50 dark:bg-green-900/20">
                                            <Package className={`h-16 w-16 text-green-200 dark:text-green-800 ${product.quantity <= 0 ? 'grayscale' : ''}`} />
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
                                        {product.quantity <= 0 ? (
                                            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg">
                                                Sold Out
                                            </span>
                                        ) : (
                                            <span className="bg-green-600 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg">
                                                Fresh
                                            </span>
                                        )}
                                        {product.category && (
                                            <span className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm text-green-800 dark:text-green-300 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-md border border-green-100 dark:border-green-800">
                                                {product.category}
                                            </span>
                                        )}
                                        {product.perishable && (
                                            <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg animate-pulse border border-amber-400">
                                                Perishable
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="p-5 flex-grow flex flex-col">
                                    <div className="flex-grow">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">{product.name}</h3>

                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="flex items-center gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={14}
                                                        className={i < Math.floor(product.averageRating || 0) ? "text-amber-400 fill-amber-400" : "text-gray-300"}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">
                                                ({product.reviewCount || 0} Reviews)
                                            </span>
                                        </div>

                                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 h-10">{product.description}</p>


                                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                                            <User size={10} className="text-green-500" />
                                            <span>Farmer:
                                                <Link
                                                    to={`/farmer-profile/${product.farmer?.id}`}
                                                    className="ml-1 text-gray-700 dark:text-gray-300 hover:text-green-600 transition-all underline-offset-4 hover:underline"
                                                >
                                                    {product.farmer?.fullName || product.farmer?.username || 'Farmer'}
                                                </Link>
                                            </span>
                                        </div>
                                        {product.perishable && (
                                            <p className="text-[10px] text-amber-600 dark:text-amber-500 font-bold mb-4 flex items-center gap-1">
                                                <X className="h-3 w-3" /> No delivery beyond 150km
                                            </p>
                                        )}

                                        <div className="flex items-center justify-between mb-4">
                                            <button
                                                onClick={() => selectedProductReviews?.productId === product.id ? setSelectedProductReviews(null) : fetchReviews(product.id)}
                                                className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1 text-gray-400 hover:text-green-500 transition-colors"
                                            >
                                                <MessageSquare size={12} />
                                                {selectedProductReviews?.productId === product.id ? 'Hide Reviews' : 'View Reviews'}
                                            </button>

                                            <button
                                                onClick={() => setSelectedProduct(product)}
                                                className="text-[10px] font-black uppercase tracking-widest text-green-600 dark:text-green-400 hover:underline"
                                            >
                                                View Details
                                            </button>
                                        </div>

                                    </div>

                                    {/* Review Section */}
                                    <AnimatePresence>
                                        {selectedProductReviews?.productId === product.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="mb-4 overflow-hidden border-t border-gray-100 dark:border-gray-700 pt-4"
                                            >
                                                <div className="space-y-3 max-h-40 overflow-y-auto custom-scrollbar pr-1">
                                                    {selectedProductReviews.reviews.length > 0 ? (
                                                        selectedProductReviews.reviews.map(r => (
                                                            <div key={r.id} className="bg-gray-50 dark:bg-gray-700/30 p-2 rounded-lg">
                                                                <div className="flex items-center justify-between mb-1">
                                                                    <span className="text-[10px] font-bold text-gray-700 dark:text-gray-200">{r.user?.fullName || 'User'}</span>
                                                                    <div className="flex items-center gap-0.5">
                                                                        {[...Array(5)].map((_, i) => (
                                                                            <Star key={i} size={8} className={i < r.rating ? "text-amber-400 fill-amber-400" : "text-gray-300"} />
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                                <p className="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-2">{r.comment}</p>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p className="text-[10px] text-gray-400 text-center py-2 italic">No reviews yet.</p>
                                                    )}
                                                </div>

                                                {user && user.roles.includes('RETAILER') && (
                                                    <div className="mt-4 space-y-2">
                                                        <div className="flex items-center gap-1">
                                                            {[1, 2, 3, 4, 5].map(star => (
                                                                <Star
                                                                    key={star}
                                                                    size={14}
                                                                    className={`cursor-pointer transition-colors ${star <= reviewForm.rating ? "text-amber-400 fill-amber-400" : "text-gray-300"}`}
                                                                    onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                                                                />
                                                            ))}
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <input
                                                                type="text"
                                                                value={reviewForm.comment}
                                                                onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                                                                placeholder="Add a review..."
                                                                className="flex-grow text-[10px] bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-green-500"
                                                            />
                                                            <button
                                                                disabled={isSubmittingReview || !reviewForm.comment.trim()}
                                                                onClick={() => handleSubmitReview(product.id)}
                                                                className="bg-green-600 text-white p-1.5 rounded-lg disabled:opacity-50"
                                                            >
                                                                <Check size={12} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                                        <div className="flex flex-col">
                                            <span className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                                                <IndianRupee className="h-5 w-5 mr-1" />
                                                {product.price}
                                            </span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">per {product.unit || 'Unit'}</span>
                                        </div>

                                        <div className="text-right">
                                            <div className={`text-xs font-bold uppercase tracking-tight mb-1 ${product.quantity <= 10 ? 'text-orange-600 dark:text-orange-400 animate-pulse' : 'text-gray-400 dark:text-gray-500'}`}>
                                                {product.quantity > 0 ? (
                                                    <>Only {product.quantity} {product.unit} left</>
                                                ) : (
                                                    <span className="text-red-600">Out of Stock</span>
                                                )}
                                            </div>
                                            {(!user || (user && user.roles.includes('RETAILER'))) && (
                                                <div className="flex space-x-2">
                                                    {product.quantity <= 0 ? (
                                                        <button
                                                            disabled
                                                            className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm font-bold rounded-lg cursor-not-allowed uppercase tracking-wider border border-gray-300 dark:border-gray-600"
                                                        >
                                                            Sold Out
                                                        </button>
                                                    ) : (
                                                        <>
                                                            <button
                                                                onClick={() => handleBuyNow(product)}
                                                                className="px-3 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors shadow-sm"
                                                            >
                                                                Buy Now
                                                            </button>
                                                            <button
                                                                onClick={() => handleAddToCart(product)}
                                                                className={`p-2 rounded-lg transition-colors shadow-sm hover:shadow-md ${addedItems[product.id]
                                                                    ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400'
                                                                    : 'bg-green-600 text-white hover:bg-green-700'
                                                                    }`}
                                                                disabled={addedItems[product.id]}
                                                            >
                                                                {addedItems[product.id] ? <Check className="h-5 w-5" /> : <ShoppingCart className="h-5 w-5" />}
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}

            {/* Product Details Modal */}
            <AnimatePresence>
                {selectedProduct && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden relative shadow-2xl flex flex-col md:flex-row"
                        >
                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="absolute top-4 right-4 z-10 p-2 bg-white/80 dark:bg-gray-700/80 rounded-full hover:bg-white dark:hover:bg-gray-600 transition-all shadow-lg"
                            >
                                <X size={20} />
                            </button>

                            {/* Left Side: Images */}
                            <div className="w-full md:w-1/2 bg-gray-50 dark:bg-gray-900/40 p-12 flex items-center justify-center">
                                {selectedProduct.imageUrl ? (
                                    <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="max-w-full max-h-full object-contain rounded-2xl shadow-xl" />
                                ) : (
                                    <Package className="h-32 w-32 text-gray-200" />
                                )}
                            </div>

                            {/* Right Side: Info */}
                            <div className="w-full md:w-1/2 p-10 overflow-y-auto custom-scrollbar">
                                <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block">
                                    {selectedProduct.category}
                                </span>
                                <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2 leading-tight">{selectedProduct.name}</h2>

                                <div className="flex items-center gap-3 mb-6">
                                    <div className="flex items-center gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={18}
                                                className={i < Math.floor(selectedProduct.averageRating || 0) ? "text-amber-400 fill-amber-400" : "text-gray-300"}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
                                        {selectedProduct.averageRating || 0} / 5 ({selectedProduct.reviewCount || 0} verified reviews)
                                    </span>
                                </div>

                                <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-2xl mb-8 flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest mb-1">Price</span>
                                        <span className="text-3xl font-black text-gray-900 dark:text-white flex items-center">
                                            <IndianRupee size={24} />
                                            {selectedProduct.price}
                                            <span className="text-sm font-medium text-gray-500 ml-1">/ {selectedProduct.unit}</span>
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest mb-1">Availability</span>
                                        <div className={`text-sm font-bold ${selectedProduct.quantity > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                            {selectedProduct.quantity > 0 ? `In Stock (${selectedProduct.quantity} units)` : 'Out of Stock'}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-xs font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest mb-2">Description</h3>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{selectedProduct.description}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 rounded-2xl shadow-sm">
                                            <h3 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                                                <Sprout size={12} className="text-green-500" /> Farmer
                                            </h3>
                                            <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{selectedProduct.farmer?.fullName || 'Agri Farmer'}</p>
                                            <p className="text-[10px] text-gray-500">{selectedProduct.farmer?.address || 'Certified Organic Source'}</p>
                                        </div>
                                        {selectedProduct.perishable && (
                                            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 p-4 rounded-2xl shadow-sm">
                                                <h3 className="text-[10px] font-black text-amber-600/60 dark:text-amber-500/60 uppercase tracking-widest mb-2 flex items-center gap-1">
                                                    <Info size={12} /> Local Product
                                                </h3>
                                                <p className="text-xs font-bold text-amber-700 dark:text-amber-500 leading-tight">Fast delivery required. Max distance: 150km</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-4 pt-6">
                                        <button
                                            onClick={() => handleBuyNow(selectedProduct)}
                                            disabled={selectedProduct.quantity <= 0}
                                            className="flex-grow bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-black py-4 rounded-2xl shadow-xl shadow-green-500/20 transition-all transform hover:-translate-y-1 active:scale-95 text-sm uppercase tracking-widest"
                                        >
                                            Buy & Checkout Now
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleAddToCart(selectedProduct);
                                            }}
                                            disabled={selectedProduct.quantity <= 0}
                                            className="p-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all shadow-md group"
                                        >
                                            <ShoppingCart size={24} className="group-hover:scale-110 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Marketplace;

