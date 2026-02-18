import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Menu, X, LogOut, User, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

import logo from '../assets/logo.png';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cart } = useCart();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <img src={logo} alt="AgriTrade Logo" className="h-10 w-auto mr-2" />
                            <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                AgriTrade
                            </span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-gray-700 hover:text-green-600 font-medium transition-colors">Home</Link>
                        <Link to="/products" className="text-gray-700 hover:text-green-600 font-medium transition-colors">Marketplace</Link>

                        {(!user || (user && user.roles.includes('RETAILER'))) && (
                            <Link to="/cart" className="relative group p-2 text-gray-700 hover:text-green-600 transition-colors">
                                <ShoppingCart className="h-6 w-6" />
                                {cart.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                        {cart.length}
                                    </span>
                                )}
                            </Link>
                        )}

                        {user ? (
                            <div className="flex items-center space-x-4">
                                {(!user.roles || !user.roles.includes('ADMIN')) && (
                                    <Link to="/dashboard" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
                                        Dashboard
                                    </Link>
                                )}
                                {user.roles && user.roles.includes('ADMIN') && (
                                    <Link to="/admin" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
                                        Admin Dashboard
                                    </Link>
                                )}
                                <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/profile')}>
                                    <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-green-500">
                                        {user.profilePhoto ? (
                                            <img
                                                src={`${import.meta.env.VITE_API_BASE_URL}${user.profilePhoto}`}
                                                alt="Profile"
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                                                <User size={16} className="text-gray-500" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-1 text-red-600 hover:text-red-700 font-medium transition-colors"
                                >
                                    <LogOut size={18} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="text-gray-700 hover:text-green-600 font-medium transition-colors">Login</Link>
                                <Link
                                    to="/signup"
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-700 hover:text-green-600 focus:outline-none"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden bg-white shadow-lg absolute w-full">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50">Home</Link>
                        <Link to="/products" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50">Marketplace</Link>
                        {(!user || (user && user.roles.includes('RETAILER'))) && (
                            <Link to="/cart" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50">
                                Cart ({cart.length})
                            </Link>
                        )}
                        {user ? (
                            <>
                                {(!user.roles || !user.roles.includes('ADMIN')) && (
                                    <Link to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50">Dashboard</Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50">Login</Link>
                                <Link to="/signup" className="block px-3 py-2 rounded-md text-base font-medium text-green-600 hover:bg-green-50">Sign Up</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
