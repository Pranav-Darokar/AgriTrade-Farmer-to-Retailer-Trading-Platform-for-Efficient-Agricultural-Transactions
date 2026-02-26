import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import {
    Menu, X, LogOut, User, ShoppingCart, ClipboardList,
    Moon, Sun, ChevronDown, Package, LayoutDashboard
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.png';

const NavLink = ({ to, children, onClick }) => {
    const { pathname } = useLocation();
    const isActive = pathname === to;
    return (
        <Link
            to={to}
            onClick={onClick}
            className={`relative text-sm font-semibold transition-colors duration-200 group
                ${isActive
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400'
                }`}
        >
            {children}
            {/* animated underline */}
            <span
                className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-300
                    ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}
            />
        </Link>
    );
};

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cart } = useCart();
    const { isDark, toggleDark } = useTheme();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    // Scroll listener — add shadow + more opaque bg after 20px
    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handler);
        return () => window.removeEventListener('scroll', handler);
    }, []);

    const handleLogout = () => {
        logout();
        setProfileOpen(false);
        setIsOpen(false);
        navigate('/login');
    };

    const isRetailer = user?.roles?.some(r => r.includes('RETAILER'));
    const isFarmer = user?.roles?.some(r => r.includes('FARMER'));
    const isAdmin = user?.roles?.some(r => r.includes('ADMIN'));

    return (
        <nav
            className={`sticky top-0 z-50 transition-all duration-300
                ${scrolled
                    ? 'bg-white/95 dark:bg-gray-900/95 shadow-lg shadow-black/5 dark:shadow-black/20'
                    : 'bg-white/80 dark:bg-gray-900/80'
                } backdrop-blur-xl border-b border-gray-200/60 dark:border-gray-700/60`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* ── Logo ── */}
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-green-400/20 rounded-lg blur-sm group-hover:bg-green-400/30 transition-all duration-300" />
                            <img src={logo} alt="AgriTrade" className="relative h-9 w-auto" />
                        </div>
                        <span className="text-xl font-extrabold bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent tracking-tight">
                            AgriTrade
                        </span>
                    </Link>

                    {/* ── Desktop Nav ── */}
                    <div className="hidden md:flex items-center gap-7">
                        <NavLink to="/">Home</NavLink>
                        <NavLink to="/products">Marketplace</NavLink>
                        <NavLink to="/about">About</NavLink>
                        <NavLink to="/contact">Contact</NavLink>

                        {isFarmer && (
                            <NavLink to="/farmer-orders">
                                <span className="flex items-center gap-1.5">
                                    <ClipboardList className="h-4 w-4" />Orders
                                </span>
                            </NavLink>
                        )}
                        {isRetailer && (
                            <NavLink to="/my-orders">
                                <span className="flex items-center gap-1.5">
                                    <ClipboardList className="h-4 w-4" />My Orders
                                </span>
                            </NavLink>
                        )}
                        {!isAdmin && user && (
                            <NavLink to="/dashboard">
                                <span className="flex items-center gap-1.5">
                                    <LayoutDashboard className="h-4 w-4" />Dashboard
                                </span>
                            </NavLink>
                        )}
                        {isAdmin && (
                            <NavLink to="/admin">Admin</NavLink>
                        )}
                    </div>

                    {/* ── Desktop Right Actions ── */}
                    <div className="hidden md:flex items-center gap-2">

                        {/* Cart */}
                        {(!user || isRetailer) && (
                            <Link to="/cart" className="relative p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400 transition-all duration-200">
                                <ShoppingCart className="h-5 w-5" />
                                <AnimatePresence>
                                    {cart.length > 0 && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                            className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center"
                                        >
                                            {cart.length}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </Link>
                        )}

                        {/* Dark mode toggle */}
                        <button
                            onClick={toggleDark}
                            aria-label="Toggle dark mode"
                            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-yellow-300 transition-all duration-200"
                        >
                            <motion.div
                                key={isDark ? 'sun' : 'moon'}
                                initial={{ rotate: -45, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                transition={{ duration: 0.2 }}
                            >
                                {isDark ? <Sun size={16} /> : <Moon size={16} />}
                            </motion.div>
                        </button>

                        {/* Profile / Auth */}
                        {user ? (
                            <div className="relative ml-1">
                                <button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                                >
                                    <div className="h-7 w-7 rounded-full overflow-hidden ring-2 ring-green-400 ring-offset-1 dark:ring-offset-gray-900">
                                        {user.profilePhoto ? (
                                            <img
                                                src={user.profilePhoto.startsWith('http') ? user.profilePhoto : `${import.meta.env.VITE_API_BASE_URL}${user.profilePhoto}`}
                                                alt="Profile"
                                                className="h-full w-full object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling?.classList.remove('hidden');
                                                }}
                                            />
                                        ) : null}
                                        <div className={`h-full w-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center ${user.profilePhoto ? 'hidden' : ''}`}>
                                            <User size={14} className="text-white" />
                                        </div>
                                    </div>
                                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 max-w-[80px] truncate">
                                        {user.name?.split(' ')[0] || 'Me'}
                                    </span>
                                    <ChevronDown size={12} className={`text-gray-500 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown */}
                                <AnimatePresence>
                                    {profileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-black/10 dark:shadow-black/30 border border-gray-100 dark:border-gray-700 overflow-hidden"
                                        >
                                            <Link
                                                to="/profile"
                                                onClick={() => setProfileOpen(false)}
                                                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                <User size={15} className="text-green-600" />
                                                View Profile
                                            </Link>
                                            {isFarmer && (
                                                <Link
                                                    to="/my-products"
                                                    onClick={() => setProfileOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                                >
                                                    <Package size={15} className="text-green-600" />
                                                    My Products
                                                </Link>
                                            )}
                                            <div className="border-t border-gray-100 dark:border-gray-700" />
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                            >
                                                <LogOut size={15} />
                                                Logout
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 ml-1">
                                <Link to="/login" className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 px-3 py-1.5 rounded-lg transition-colors">
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 px-4 py-2 rounded-xl shadow-md shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-200 transform hover:-translate-y-0.5"
                                >
                                    Sign Up Free
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* ── Mobile: dark toggle + hamburger ── */}
                    <div className="md:hidden flex items-center gap-2">
                        {(!user || isRetailer) && (
                            <Link to="/cart" className="relative p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
                                <ShoppingCart className="h-5 w-5" />
                                {cart.length > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                        {cart.length}
                                    </span>
                                )}
                            </Link>
                        )}
                        <button
                            onClick={toggleDark}
                            aria-label="Toggle dark mode"
                            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-yellow-300 transition-all duration-200"
                        >
                            {isDark ? <Sun size={16} /> : <Moon size={16} />}
                        </button>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={isOpen ? 'x' : 'menu'}
                                    initial={{ rotate: -90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    {isOpen ? <X size={22} /> : <Menu size={22} />}
                                </motion.div>
                            </AnimatePresence>
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Mobile Drawer ── */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden overflow-hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900"
                    >
                        <div className="px-4 py-4 space-y-1">
                            {[
                                { to: '/', label: 'Home' },
                                { to: '/products', label: 'Marketplace' },
                                { to: '/about', label: 'About' },
                                { to: '/contact', label: 'Contact Us' },
                                ...(isFarmer ? [{ to: '/farmer-orders', label: 'Incoming Orders' }] : []),
                                ...(isRetailer ? [{ to: '/my-orders', label: 'My Orders' }] : []),
                                ...(!isAdmin && user ? [{ to: '/dashboard', label: 'Dashboard' }] : []),
                                ...(isAdmin ? [{ to: '/admin', label: 'Admin Dashboard' }] : []),
                            ].map(item => (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    onClick={() => setIsOpen(false)}
                                    className="block px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                                >
                                    {item.label}
                                </Link>
                            ))}

                            <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                                {user ? (
                                    <>
                                        <Link
                                            to="/profile"
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                        >
                                            <User size={15} className="text-green-600" />
                                            {user.name || 'Profile'}
                                        </Link>
                                        {isFarmer && (
                                            <Link
                                                to="/my-products"
                                                onClick={() => setIsOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                            >
                                                <Package size={15} className="text-green-600" />
                                                My Products
                                            </Link>
                                        )}
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors mt-1"
                                        >
                                            <LogOut size={15} />Logout
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex flex-col gap-2 pt-1">
                                        <Link to="/login" onClick={() => setIsOpen(false)} className="px-4 py-2.5 rounded-xl text-sm font-medium text-center text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                            Login
                                        </Link>
                                        <Link to="/signup" onClick={() => setIsOpen(false)} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-center text-white bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 transition-all shadow-md">
                                            Sign Up Free
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
