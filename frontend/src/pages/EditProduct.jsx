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
            const token = user?.token;

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
            const token = user?.token;

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

            const token = user?.token;

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

    const inputClasses = "focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-lg p-3 border bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors";
    const labelClasses = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 transition-colors";

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 transition-colors">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700 transition-colors"
            >
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-8 transition-colors">
                    <h1 className="text-3xl font-bold text-white flex items-center">
                        <Edit className="mr-3 h-8 w-8" />
                        Edit Product
                    </h1>
                    <p className="text-blue-100 mt-2 text-lg">Update your product details and stay updated.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    <div>
                        <label className={labelClasses}>Product Name</label>
                        <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Tag className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                            </div>
                            <input
                                type="text"
                                name="name"
                                required
                                className={inputClasses}
                                placeholder="e.g. Organic Tomatoes"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label className={labelClasses}>Description</label>
                        <div className="relative rounded-md shadow-sm">
                            <div className="absolute top-3.5 left-3 flex items-start pointer-events-none">
                                <FileText className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                            </div>
                            <textarea
                                name="description"
                                rows="4"
                                className={`${inputClasses} pl-10 pt-3`}
                                placeholder="Describe your product (freshness, origin, etc.)"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className={labelClasses}>Price per Unit (₹)</label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <DollarSign className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                </div>
                                <input
                                    type="number"
                                    name="price"
                                    step="0.01"
                                    min="0"
                                    required
                                    className={inputClasses}
                                    placeholder="0.00"
                                    value={formData.price}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className={labelClasses}>Quantity & Unit</label>
                            <div className="flex space-x-3">
                                <div className="relative rounded-md shadow-sm w-full">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Package className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <input
                                        type="number"
                                        name="quantity"
                                        min="0"
                                        required
                                        className={inputClasses}
                                        placeholder="e.g. 100"
                                        value={formData.quantity}
                                        onChange={handleChange}
                                    />
                                </div>
                                <select
                                    name="unit"
                                    value={formData.unit}
                                    onChange={handleChange}
                                    className="block w-32 pl-3 pr-8 py-2 text-sm border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
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

                        <div className="md:col-span-2">
                            <label className={labelClasses}>Category</label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Tag className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                </div>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className={inputClasses}
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
                        <label className={labelClasses}>Product Image</label>
                        <div className="mb-6">
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-xl hover:border-blue-500 dark:hover:border-blue-400 transition-colors bg-gray-50/50 dark:bg-gray-700/30">
                                <div className="space-y-1 text-center">
                                    {previewUrl ? (
                                        <div className="relative inline-block">
                                            <img src={previewUrl} alt="Preview" className="mx-auto h-52 w-auto object-cover rounded-lg shadow-md" />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedFile(null);
                                                    setPreviewUrl(null);
                                                }}
                                                className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 focus:outline-none shadow-lg transition-transform hover:scale-110"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                                            <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                                <label
                                                    htmlFor="file-upload-edit"
                                                    className="relative cursor-pointer bg-transparent rounded-md font-bold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 focus-within:outline-none"
                                                >
                                                    <span>Upload a file</span>
                                                    <input id="file-upload-edit" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium">Or provide an image URL</span>
                            </div>
                        </div>

                        <div className="mt-6 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <ImageIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                            </div>
                            <input
                                type="text"
                                name="imageUrl"
                                className={inputClasses}
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
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-800 flex items-center gap-3 transition-colors">
                            <X className="h-5 w-5 flex-shrink-0" />
                            <p className="font-medium text-sm">{error}</p>
                        </div>
                    )}

                    <div className="flex flex-wrap justify-end gap-4 pt-6">
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="px-8 py-3 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-bold rounded-xl text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving || uploading}
                            className="px-8 py-3 border border-transparent shadow-lg text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-70 flex items-center gap-2 transform transition-all hover:-translate-y-0.5"
                        >
                            {(saving || uploading) ? (
                                <>
                                    <Loader2 className="animate-spin h-5 w-5" />
                                    {uploading ? 'Uploading...' : 'Saving...'}
                                </>
                            ) : (
                                <>
                                    <Edit className="h-5 w-5" />
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
