import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Edit, Loader2, DollarSign, Package, FileText, Tag, Upload, X, Image as ImageIcon } from 'lucide-react';

const EditProduct = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        quantity: '',
        unit: 'Kg',
        imageUrl: '',
        category: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        fetchProductDetails();
    }, [id]);

    const fetchProductDetails = async () => {
        try {
            const userData = JSON.parse(localStorage.getItem('user'));
            const token = userData?.token;

            // Since we don't have a direct "get product by id for farmer" distinct from public,
            // we can use the public one or filter from "my products".
            // Ideally, we should have a GET /api/farmer/products/{id} but let's see if public works or if we need to fetch all.
            // Wait, ProductService has getProductById but Controller doesn't expose it specifically for Farmer single GET maybe?
            // Actually, we can just use the public one /api/public/products if we filter or just add a getter.
            // Let's try to find it in the public list first or assuming we might need to add a GET endpoint.
            // BETTER: Add a GET /api/farmer/products/{id} to ProductController or use existing logic.
            // Reviewing ProductController... it has getMyProducts (List).
            // It does NOT have getSingleProduct for farmer.
            // However, there is likely a public endpoint?
            // "getAllProducts" is public.
            // Let's implement a fetch that gets all "my products" and finds the one to edit,
            // OR use the public list.
            // For now, let's fetch "my products" and find it. This is safer although less efficient.

            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/farmer/products`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const product = response.data.find(p => p.id === parseInt(id));

            if (product) {
                setFormData({
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    quantity: product.quantity,
                    unit: product.unit || 'Kg',
                    imageUrl: product.imageUrl || '',
                    category: product.category || 'Fresh Vegetables'
                });
                if (product.imageUrl) {
                    setPreviewUrl(product.imageUrl);
                }
            } else {
                setError('Product not found.');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to fetch product details.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setFormData({ ...formData, imageUrl: '' });
        }
    };

    const uploadImage = async () => {
        if (!selectedFile) return null;

        const uploadData = new FormData();
        uploadData.append('file', selectedFile);

        try {
            const userData = JSON.parse(localStorage.getItem('user'));
            const token = userData?.token;

            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/upload`, uploadData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (err) {
            console.error('File upload failed:', err);
            setError('Failed to upload image. Please try again or use a URL.');
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setUploading(true);

        try {
            let finalImageUrl = formData.imageUrl;

            if (selectedFile) {
                const uploadedUrl = await uploadImage();
                if (uploadedUrl) {
                    finalImageUrl = uploadedUrl;
                } else {
                    setSaving(false);
                    setUploading(false);
                    return;
                }
            }

            const userData = JSON.parse(localStorage.getItem('user'));
            const token = userData?.token;

            const productData = { ...formData, imageUrl: finalImageUrl };

            await axios.put(
                `${import.meta.env.VITE_API_BASE_URL}/api/farmer/products/${id}`,
                productData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            setError('Failed to update product. Please try again.');
        } finally {
            setSaving(false);
            setUploading(false);
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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
            >
                <div className="bg-blue-600 px-8 py-6">
                    <h1 className="text-2xl font-bold text-white flex items-center">
                        <Edit className="mr-2" />
                        Edit Product
                    </h1>
                    <p className="text-blue-100 mt-1">Update your product details.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                        <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Tag className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                name="name"
                                required
                                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-3 border"
                                placeholder="e.g. Organic Tomatoes"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <div className="relative rounded-md shadow-sm">
                            <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                                <FileText className="h-5 w-5 text-gray-400" />
                            </div>
                            <textarea
                                name="description"
                                rows="4"
                                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-3 border"
                                placeholder="Describe your product (freshness, origin, etc.)"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price per Unit (₹)</label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <DollarSign className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="number"
                                    name="price"
                                    step="0.01"
                                    min="0"
                                    required
                                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-3 border"
                                    placeholder="0.00"
                                    value={formData.price}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity Available</label>
                            <div className="flex space-x-2">
                                <div className="relative rounded-md shadow-sm w-full">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Package className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="number"
                                        name="quantity"
                                        min="0"
                                        required
                                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-3 border"
                                        placeholder="e.g. 100"
                                        value={formData.quantity}
                                        onChange={handleChange}
                                    />
                                </div>
                                <select
                                    name="unit"
                                    value={formData.unit}
                                    onChange={handleChange}
                                    className="block w-24 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
                                >
                                    <option value="Kg">Kg</option>
                                    <option value="Gram">Gram</option>
                                    <option value="Quintal">Quintal</option>
                                    <option value="Ton">Ton</option>
                                    <option value="Dozen">Dozen</option>
                                    <option value="Liter">Liter</option>
                                    <option value="Piece">Piece</option>
                                    <option value="Box">Box</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Tag className="h-5 w-5 text-gray-400" />
                                </div>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-3 border"
                                >
                                    <option value="Fresh Vegetables">Fresh Vegetables</option>
                                    <option value="Fruits">Fruits</option>
                                    <option value="Grains & Pulses">Grains & Pulses</option>
                                    <option value="Dairy">Dairy</option>
                                    <option value="Essentials">Essentials</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                        <div className="mb-4">
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-500 transition-colors">
                                <div className="space-y-1 text-center">
                                    {previewUrl ? (
                                        <div className="relative">
                                            <img src={previewUrl} alt="Preview" className="mx-auto h-48 object-contain" />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedFile(null);
                                                    setPreviewUrl(null);
                                                }}
                                                className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                            <div className="flex text-sm text-gray-600">
                                                <label
                                                    htmlFor="file-upload-edit"
                                                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                                                >
                                                    <span>Upload a file</span>
                                                    <input id="file-upload-edit" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center">
                                <span className="px-2 bg-white text-sm text-gray-500">Or use URL</span>
                            </div>
                        </div>

                        <div className="mt-4 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <ImageIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                name="imageUrl"
                                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-3 border"
                                placeholder="https://example.com/image.jpg"
                                value={formData.imageUrl}
                                onChange={(e) => {
                                    setFormData({ ...formData, imageUrl: e.target.value });
                                    setSelectedFile(null);
                                    setPreviewUrl(null);
                                }}
                                disabled={!!selectedFile}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end space-x-4 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="px-6 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving || uploading}
                            className="px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 flex items-center"
                        >
                            {(saving || uploading) ? (
                                <>
                                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                                    {uploading ? 'Uploading...' : 'Saving...'}
                                </>
                            ) : (
                                <>
                                    <Edit className="h-5 w-5 mr-2" />
                                    Update Product
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default EditProduct;
