import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, Search, Filter, Loader2, IndianRupee, Package, Info, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Marketplace = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
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

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                    <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
                    <p className="mt-1 text-gray-500">Fresh produce directly from farmers.</p>
                </div>

                <div className="relative w-full md:w-96">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        placeholder="Search for products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center min-h-[40vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                </div>
            ) : error ? (
                <div className="text-center text-red-600 py-10">{error}</div>
            ) : filteredProducts.length === 0 ? (
                <div className="text-center py-16">
                    <Package className="mx-auto h-16 w-16 text-gray-300" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No products found</h3>
                    <p className="mt-1 text-gray-500">Try adjusting your search terms or check back later.</p>
                </div>
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                >
                    {filteredProducts.map((product) => (
                        <motion.div
                            key={product.id}
                            variants={itemVariants}
                            className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col"
                        >
                            <div className="h-48 bg-gray-200 relative">
                                {product.imageUrl ? (
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-green-50">
                                        <Package className="h-16 w-16 text-green-200" />
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                    fresh
                                </div>
                            </div>

                            <div className="p-5 flex-grow flex flex-col">
                                <div className="flex-grow">
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h3>
                                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">{product.description}</p>

                                    <div className="flex items-center text-xs text-gray-400 mb-4">
                                        <Info className="h-3 w-3 mr-1" />
                                        <span>Sold by: {product.farmer?.username || 'Farmer'}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                                    <span className="text-2xl font-bold text-gray-900 flex items-center">
                                        <IndianRupee className="h-5 w-5 mr-1" />
                                        {product.price}
                                    </span>
                                    <span className="text-gray-500 text-sm">/ {product.unit || 'Unit'}</span>
                                    {(!user || (user && user.roles.includes('RETAILER'))) && (
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleBuyNow(product)}
                                                className="px-3 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors shadow-sm"
                                            >
                                                Buy Now
                                            </button>
                                            <button
                                                onClick={() => handleAddToCart(product)}
                                                className={`p-2 rounded-lg transition-colors shadow-sm hover:shadow-md ${addedItems[product.id]
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-green-600 text-white hover:bg-green-700'
                                                    }`}
                                                disabled={addedItems[product.id]}
                                            >
                                                {addedItems[product.id] ? <Check className="h-5 w-5" /> : <ShoppingCart className="h-5 w-5" />}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
};

export default Marketplace;
