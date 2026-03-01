import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Plus, Package, IndianRupee, X, EyeOff, Eye } from 'lucide-react';

const MyProducts = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const token = user?.token;

            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/farmer/products`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setProducts(response.data);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch your products.');
        } finally {
            setLoading(false);
        }
    };

    const toggleStockStatus = async (product) => {
        const isCurrentlyOutOfStock = product.quantity <= 0;
        const confirmMsg = isCurrentlyOutOfStock
            ? `Mark "${product.name}" as in stock? (Quantity will be set to 50)`
            : `Mark "${product.name}" as out of stock? (Quantity will be set to 0)`;

        if (!window.confirm(confirmMsg)) return;

        try {
            const token = user?.token;

            const newQuantity = isCurrentlyOutOfStock ? 50 : 0;
            const updatedProduct = { ...product, quantity: newQuantity };

            console.log(`Updating product ${product.id} quantity to ${newQuantity}`);

            const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/farmer/products/${product.id}`, updatedProduct, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log('Update response:', response.data);

            setProducts(prevProducts =>
                prevProducts.map(p => p.id === product.id ? { ...p, quantity: newQuantity } : p)
            );
        } catch (err) {
            console.error('Error toggling stock status:', err);
            alert('Failed to update product status. Please check your connection.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            const token = user?.token;

            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/farmer/products/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setProducts(products.filter(p => p.id !== id));
        } catch (err) {
            console.error(err);
            alert('Failed to delete product.');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors">
            <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">My Listings</h1>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">Manage your product inventory.</p>
                </div>
                <Link
                    to="/add-product"
                    className="flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all transform hover:-translate-y-0.5"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Product
                </Link>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-lg mb-6 flex items-center border border-red-100 dark:border-red-800 transition-colors">
                    <span className="font-medium mr-2">Error:</span> {error}
                </div>
            )}

            {products.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                    <Package className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No products listed</h3>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">Get started by creating a new product listing.</p>
                    <div className="mt-8">
                        <Link
                            to="/add-product"
                            className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
                        >
                            <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                            Add Your First Product
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map((product) => (
                        <div key={product.id} className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 flex flex-col">
                            <div className="h-52 bg-gray-100 dark:bg-gray-700 relative overflow-hidden transition-colors">
                                {product.imageUrl ? (
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                                        }}
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center">
                                        <Package className="h-16 w-16 text-green-300 dark:text-green-600" />
                                    </div>
                                )}
                            </div>
                            <div className="px-6 py-5 flex-1">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate transition-colors" title={product.name}>{product.name}</h3>
                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 h-10 overflow-hidden line-clamp-2 transition-colors">{product.description}</p>

                                <div className="mt-6 flex items-center justify-between">
                                    <div className="flex items-center text-green-600 dark:text-green-400 font-bold text-2xl transition-colors">
                                        <IndianRupee className="h-5 w-5" />
                                        {product.price}
                                    </div>
                                    <div className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider transition-colors ${product.quantity <= 0 ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/50' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                                        {product.quantity <= 0 ? (
                                            <span className="flex items-center">
                                                <X className="h-3 w-3 mr-1" />
                                                Sold Out
                                            </span>
                                        ) : (
                                            <>{product.quantity} {product.unit} left</>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 flex justify-between items-center transition-colors">
                                <button
                                    onClick={() => toggleStockStatus(product)}
                                    className={`transition-all flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-3 py-2 rounded-lg border ${product.quantity <= 0
                                        ? 'text-green-600 dark:text-green-400 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40'
                                        : 'text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600 dark:hover:text-orange-400 hover:border-orange-200 dark:hover:border-orange-800'
                                        }`}
                                    title={product.quantity <= 0 ? "Mark as In Stock" : "Mark as Sold Out"}
                                >
                                    {product.quantity <= 0 ? (
                                        <>
                                            <Eye className="h-3.5 w-3.5" />
                                            <span>Restock</span>
                                        </>
                                    ) : (
                                        <>
                                            <EyeOff className="h-3.5 w-3.5" />
                                            <span>Sold Out</span>
                                        </>
                                    )}
                                </button>
                                <div className="flex items-center space-x-3 border-l border-gray-200 dark:border-gray-600 pl-4 transition-colors">
                                    <Link to={`/edit-product/${product.id}`} className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" title="Edit Product">
                                        <Edit className="h-5 w-5" />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                        title="Delete Product"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyProducts;
