import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Loader2, User, Phone, Lock, Hash, Eye, EyeOff } from 'lucide-react';

import logo from '../assets/logo.png';

const Signup = () => {
    const [formData, setFormData] = useState({
        password: '',
        fullName: '',
        contactInfo: '', // Deprecated, using mobileNumber
        mobileNumber: '',
        email: '',
        address: '',
        gender: '',
        dateOfBirth: '',
        aadhaarNumber: '',
        licenceNumber: '', // for retailers
        role: 'farmer' // default
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        setLoading(true);
        try {
            await register({
                // No username
                password: formData.password,
                fullName: formData.fullName,
                mobileNumber: formData.mobileNumber,
                email: formData.email,
                address: formData.address,
                gender: formData.gender,
                dateOfBirth: formData.dateOfBirth,
                aadhaarNumber: (formData.role === 'farmer' && formData.aadhaarNumber) ? formData.aadhaarNumber : null,
                licenceNumber: formData.role === 'retailer' ? formData.licenceNumber : null,
                contactInfo: formData.mobileNumber, // Fallback
                role: [formData.role] // backend expects a Set/List
            });
            navigate('/login');
        } catch (err) {
            console.error("Signup error:", err);
            // Check if it is a validation error object
            if (err.response?.data && typeof err.response.data === 'object' && !err.response.data.message) {
                // It might be our map of field errors
                const fieldErrors = Object.values(err.response.data).join(', ');
                setError(fieldErrors || 'Registration failed. Please checking your input.');
            } else {
                setError(err.response?.data?.message || 'Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl w-full space-y-4 bg-white p-6 rounded-2xl shadow-xl"
            >
                <div className="text-center">
                    <img src={logo} alt="Logo" className="h-10 w-auto mx-auto" />
                    <h2 className="mt-2 text-2xl font-bold text-gray-900">
                        Create an Account
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
                            Sign in
                        </Link>
                    </p>
                </div>

                <form className="mt-4 space-y-4" onSubmit={handleSubmit}>

                    {/* Role Selection - Full Width */}
                    <div>
                        <label className="text-xs font-medium text-gray-700">I am a...</label>
                        <div className="mt-1 flex space-x-4">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'farmer' })}
                                className={`flex-1 py-2 px-4 rounded-md border text-sm transition-all ${formData.role === 'farmer'
                                    ? 'border-green-500 bg-green-50 text-green-700 font-bold shadow-sm'
                                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                                    }`}
                            >
                                Farmer
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'retailer' })}
                                className={`flex-1 py-2 px-4 rounded-md border text-sm transition-all ${formData.role === 'retailer'
                                    ? 'border-green-500 bg-green-50 text-green-700 font-bold shadow-sm'
                                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                                    }`}
                            >
                                Retailer
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Row 1: Full Name & Mobile */}
                        <div className="relative">
                            <label className="text-xs font-medium text-gray-700">Full Name</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    name="fullName"
                                    type="text"
                                    required
                                    className="focus:ring-green-500 focus:border-green-500 block w-full pl-9 sm:text-xs border-gray-300 rounded-md p-2 bg-gray-50 border h-9"
                                    placeholder="John Doe"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <label className="text-xs font-medium text-gray-700">Mobile Number</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Phone className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    name="mobileNumber"
                                    type="tel"
                                    required
                                    className="focus:ring-green-500 focus:border-green-500 block w-full pl-9 sm:text-xs border-gray-300 rounded-md p-2 bg-gray-50 border h-9"
                                    placeholder="Mobile Number"
                                    value={formData.mobileNumber}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Row 2: Email & Password */}
                        <div className="relative">
                            <label className="text-xs font-medium text-gray-700">Email (Required)</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="focus:ring-green-500 focus:border-green-500 block w-full pl-9 sm:text-xs border-gray-300 rounded-md p-2 bg-gray-50 border h-9"
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <label className="text-xs font-medium text-gray-700">Password</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="focus:ring-green-500 focus:border-green-500 block w-full pl-9 pr-10 sm:text-xs border-gray-300 rounded-md p-2 bg-gray-50 border h-9"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Row 3: Date of Birth & Gender */}
                        <div className="relative">
                            <label className="text-xs font-medium text-gray-700">Date of Birth</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <input
                                    name="dateOfBirth"
                                    type="date"
                                    required
                                    className="focus:ring-green-500 focus:border-green-500 block w-full sm:text-xs border-gray-300 rounded-md p-2 bg-gray-50 border h-9"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <label className="text-xs font-medium text-gray-700">Gender</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <select
                                    name="gender"
                                    required
                                    className="focus:ring-green-500 focus:border-green-500 block w-full sm:text-xs border-gray-300 rounded-md p-2 bg-gray-50 border h-9"
                                    value={formData.gender}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="relative">
                            <label className="text-xs font-medium text-gray-700">
                                {formData.role === 'farmer' ? 'Aadhaar Number (Optional)' : 'Licence No.'}
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Hash className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    name={formData.role === 'farmer' ? 'aadhaarNumber' : 'licenceNumber'}
                                    type="text"
                                    required={formData.role === 'retailer'}
                                    className="focus:ring-green-500 focus:border-green-500 block w-full pl-9 sm:text-xs border-gray-300 rounded-md p-2 bg-gray-50 border h-9"
                                    placeholder={formData.role === 'farmer' ? 'Aadhaar Number' : 'Licence No.'}
                                    value={formData.role === 'farmer' ? formData.aadhaarNumber : formData.licenceNumber}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Address - Full Width */}
                    <div className="relative">
                        <label className="text-xs font-medium text-gray-700">Address</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <textarea
                                name="address"
                                required
                                className="focus:ring-green-500 focus:border-green-500 block w-full sm:text-xs border-gray-300 rounded-md p-2 bg-gray-50 border"
                                placeholder="Full Address"
                                value={formData.address}
                                onChange={handleChange}
                                rows="2"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-xs text-center bg-red-50 py-1.5 rounded-md border border-red-100">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                        {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Sign Up"}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default Signup;
