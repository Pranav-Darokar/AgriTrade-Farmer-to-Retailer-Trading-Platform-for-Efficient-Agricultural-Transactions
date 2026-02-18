import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Plus, Package, IndianRupee } from 'lucide-react';

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
            const userData = JSON.parse(localStorage.getItem('user'));
            const token = userData?.token;

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

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            const userData = JSON.parse(localStorage.getItem('user'));
            const token = userData?.token;

            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/farmer/products/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            // Remove from state
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
                    <p className="mt-1 text-gray-500">Manage your product inventory.</p>
                </div>
                <Link
                    to="/add-product"
                    className="flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Product
                </Link>
            </div>

            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 flex items-center">
                    <span className="font-medium">Error:</span> {error}
                </div>
            )}

            {products.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                    <Package className="mx-auto h-12 w-12 text-gray-300" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No products listed</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new product listing.</p>
                    <div className="mt-6">
                        <Link
                            to="/add-product"
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                            Add Product
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map((product) => (
                        <div key={product.id} className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100 hover:shadow-xl transition-shadow duration-300">
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
                                    <div className="flex h-full items-center justify-center">
                                        <Package className="h-16 w-16 text-green-300" />
                                    </div>
                                )}
                            </div>
                            <div className="px-6 py-4">
                                <h3 className="text-lg font-bold text-gray-900 truncate" title={product.name}>{product.name}</h3>
                                <p className="mt-1 text-sm text-gray-500 h-10 overflow-hidden line-clamp-2">{product.description}</p>

                                <div className="mt-4 flex items-center justify-between">
                                    <div className="flex items-center text-green-600 font-bold text-xl">
                                        <IndianRupee className="h-5 w-5" />
                                        {product.price}
                                    </div>
                                    <div className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                                        Qty: {product.quantity} {product.unit}
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                                <Link to={`/edit-product/${product.id}`} className="text-gray-400 hover:text-blue-600 transition-colors">
                                    <Edit className="h-5 w-5" />
                                </Link>
                                <button
                                    onClick={() => handleDelete(product.id)}
                                    className="text-gray-400 hover:text-red-600 transition-colors"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyProducts;
