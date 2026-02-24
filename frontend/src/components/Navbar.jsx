import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { Menu, X, LogOut, User, ShoppingCart, ClipboardList, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import logo from '../assets/logo.png';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cart } = useCart();
    const { isDark, toggleDark } = useTheme();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isRetailer = user?.roles?.some(r => r.includes('RETAILER'));
    const isFarmer = user?.roles?.some(r => r.includes('FARMER'));
    const isAdmin = user?.roles?.some(r => r.includes('ADMIN'));

    return (
        <nav className="bg-white/80 dark:bg-gray-900/90 backdrop-blur-md shadow-sm dark:shadow-gray-800 sticky top-0 z-50 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <img src={logo} alt="AgriTrade Logo" className="h-10 w-auto mr-2" />
                            <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                AgriTrade
                            </span>
                        </Link>
                    </div>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/" className="text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors">Home</Link>
                        <Link to="/products" className="text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors">Marketplace</Link>

                        {(!user || isRetailer) && (
                            <Link to="/cart" className="relative group p-2 text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                                <ShoppingCart className="h-6 w-6" />
                                {cart.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                        {cart.length}
                                    </span>
                                )}
                            </Link>
                        )}

                        {isFarmer && (
                            <Link to="/farmer-orders" className="flex items-center gap-1.5 text-gray-700 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-400 font-medium transition-colors">
                                <ClipboardList className="h-5 w-5" />Orders
                            </Link>
                        )}

                        {isRetailer && (
                            <Link to="/my-orders" className="flex items-center gap-1.5 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
                                <ClipboardList className="h-5 w-5" />My Orders
                            </Link>
                        )}

                        {user ? (
                            <div className="flex items-center space-x-4">
                                {!isAdmin && (
                                    <Link to="/dashboard" className="text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors">Dashboard</Link>
                                )}
                                {isAdmin && (
                                    <Link to="/admin" className="text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors">Admin Dashboard</Link>
                                )}
                                <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/profile')}>
                                    <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-green-500">
                                        {user.profilePhoto ? (
                                            <img src={`${import.meta.env.VITE_API_BASE_URL}${user.profilePhoto}`} alt="Profile" className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="h-full w-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                                <User size={16} className="text-gray-500 dark:text-gray-300" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <button onClick={handleLogout} className="flex items-center space-x-1 text-red-600 hover:text-red-700 font-medium transition-colors">
                                    <LogOut size={18} /><span>Logout</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors">Login</Link>
                                <Link to="/signup" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                                    Sign Up
                                </Link>
                            </div>
                        )}

                        {/* Dark mode toggle */}
                        <button
                            onClick={toggleDark}
                            aria-label="Toggle dark mode"
                            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-yellow-300 transition-all duration-200"
                        >
                            {isDark ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                    </div>

                    {/* Mobile: dark toggle + hamburger */}
                    <div className="md:hidden flex items-center gap-2">
                        <button
                            onClick={toggleDark}
                            aria-label="Toggle dark mode"
                            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-yellow-300 transition-all duration-200"
                        >
                            {isDark ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-700 dark:text-gray-200 hover:text-green-600 focus:outline-none"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden bg-white dark:bg-gray-800 shadow-lg absolute w-full transition-colors duration-300">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-green-600 hover:bg-gray-50 dark:hover:bg-gray-700">Home</Link>
                        <Link to="/products" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-green-600 hover:bg-gray-50 dark:hover:bg-gray-700">Marketplace</Link>

                        {(!user || isRetailer) && (
                            <Link to="/cart" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-green-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                                Cart ({cart.length})
                            </Link>
                        )}
                        {isFarmer && (
                            <Link to="/farmer-orders" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20">Incoming Orders</Link>
                        )}
                        {isRetailer && (
                            <Link to="/my-orders" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20">My Orders</Link>
                        )}
                        {user ? (
                            <>
                                {!isAdmin && (
                                    <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-green-600 hover:bg-gray-50 dark:hover:bg-gray-700">Dashboard</Link>
                                )}
                                <button onClick={handleLogout} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-green-600 hover:bg-gray-50 dark:hover:bg-gray-700">Login</Link>
                                <Link to="/signup" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20">Sign Up</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
