import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, Search, Filter, Loader2, IndianRupee, Package, Info, Check, X } from 'lucide-react';
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

    const handleBuyNow = (product) => {
        addToCart(product);
        navigate('/cart');
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            // Public endpoint
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/public/products`);
            setProducts(response.data);
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
                                    </div>
                                </div>

                                <div className="p-5 flex-grow flex flex-col">
                                    <div className="flex-grow">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">{product.name}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 h-10">{product.description}</p>

                                        <div className="flex items-center text-[11px] font-medium text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50 p-1.5 rounded-lg mb-4">
                                            <Info className="h-3 w-3 mr-1 text-green-600 dark:text-green-400" />
                                            <span>Farmer: <span className="text-gray-700 dark:text-gray-300 uppercase">{product.farmer?.fullName || product.farmer?.username || 'Farmer'}</span></span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                                        <span className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                                            <IndianRupee className="h-5 w-5 mr-1" />
                                            {product.price}
                                        </span>
                                        <span className="text-gray-500 dark:text-gray-400 text-sm">/ {product.unit || 'Unit'}</span>
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
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}
        </div>
    );
};

export default Marketplace;
