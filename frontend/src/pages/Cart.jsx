import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    Trash2, Plus, Minus, ShoppingBag, ArrowRight, IndianRupee,
    CheckCircle2, MapPin, Truck, ShieldCheck, AlertCircle, ShoppingCart,
    CreditCard, FileText
} from 'lucide-react';
import OrderService from '../services/OrderService';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Cart = () => {
    const { cart, total, removeFromCart, updateQuantity, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleCheckout = async () => {
        if (!user) {
            navigate('/login', { state: { from: '/cart' } });
            return;
        }

        setLoading(true);
        setError('');
        try {
            const orderRequest = {
                items: cart.map(item => ({
                    productId: item.id,
                    quantity: item.quantity
                }))
            };

            await OrderService.placeOrder(orderRequest);
            clearCart();
            setSuccess(true);
        } catch (err) {
            console.error(err);
            setError('Failed to process your order. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center justify-center min-h-[70vh]">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="h-32 w-32 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-8 ring-8 ring-green-50 dark:ring-green-900/10"
                >
                    <CheckCircle2 className="h-16 w-16 text-green-600 dark:text-green-400" />
                </motion.div>
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-center"
                >
                    <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">Order Confirmed!</h2>
                    <p className="text-xl text-gray-500 dark:text-gray-400 mb-10 max-w-md mx-auto leading-relaxed">
                        Your transaction was successful. The farmer will be notified immediately to prepare your fresh produce.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate('/my-orders')}
                            className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl shadow-xl shadow-green-600/20 transition-all hover:-translate-y-1 block"
                        >
                            Track My Order
                        </button>
                        <button
                            onClick={() => navigate('/products')}
                            className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-2xl border border-gray-200 dark:border-gray-700 transition-all hover:bg-gray-50 dark:hover:bg-gray-700/50 block"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="relative mx-auto h-40 w-40 mb-8">
                        <div className="absolute inset-0 bg-green-100 dark:bg-green-900/20 rounded-full animate-ping opacity-20"></div>
                        <div className="relative h-40 w-40 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-700 shadow-inner">
                            <ShoppingCart className="h-20 w-20 text-gray-300 dark:text-gray-600" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-3">Your cart is hungry</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-10 max-w-sm mx-auto text-lg leading-relaxed">
                        Browse the freshest farm produce and start adding items to your cart.
                    </p>
                    <button
                        onClick={() => navigate('/products')}
                        className="inline-flex items-center px-10 py-4 text-lg font-bold rounded-2xl shadow-xl text-white bg-green-600 hover:bg-green-700 transition-all hover:-translate-y-1 shadow-green-600/20 focus:ring-4 focus:ring-green-100"
                    >
                        Explore Marketplace <ArrowRight className="ml-2 h-6 w-6" />
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 transition-colors">
            <header className="mb-12">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
                        <ShoppingCart className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Checkout</h1>
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">Review your items and confirm your delivery details.</p>
            </header>

            <div className="lg:grid lg:grid-cols-12 lg:gap-12 lg:items-start">
                <div className="lg:col-span-8 flex flex-col gap-8">
                    <section className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-50 dark:border-gray-700/50 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Review Items ({cart.length})</h2>
                            <button onClick={clearCart} className="text-sm font-bold text-rose-600 hover:text-rose-700 flex items-center transition-colors">
                                <Trash2 className="h-4 w-4 mr-1" /> Clear All
                            </button>
                        </div>
                        <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                            <AnimatePresence initial={false}>
                                {cart.map((item) => (
                                    <motion.li
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0, x: -50 }}
                                        className="flex py-8 px-6 group"
                                    >
                                        <div className="h-28 w-28 flex-shrink-0 rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-900 flex items-center justify-center border border-gray-100 dark:border-gray-700 group-hover:shadow-md transition-all">
                                            {item.imageUrl ? (
                                                <img
                                                    src={item.imageUrl}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = "https://via.placeholder.com/96x96?text=No+Image";
                                                    }}
                                                />
                                            ) : (
                                                <ShoppingBag className="h-10 w-10 text-gray-300 dark:text-gray-600" />
                                            )}
                                        </div>

                                        <div className="ml-6 flex-1 flex flex-col justify-between">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white hover:text-green-600 transition-colors cursor-default">
                                                        {item.name}
                                                    </h3>
                                                    <p className="mt-1 text-sm font-bold text-green-600 dark:text-green-500 flex items-center">
                                                        <IndianRupee className="h-3.5 w-3.5" />
                                                        {item.price} <span className="text-gray-400 text-xs font-normal ml-1">/ {item.unit || 'Unit'}</span>
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="p-2 text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>

                                            <div className="mt-4 flex items-center justify-between">
                                                <div className="flex items-center bg-gray-50 dark:bg-gray-900 rounded-xl p-1 border border-gray-100 dark:border-gray-700">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                        className="p-1.5 rounded-lg text-gray-500 hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm disabled:opacity-20 transition-all font-bold"
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </button>
                                                    <span className="px-4 text-gray-900 dark:text-white font-extrabold text-sm">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        disabled={item.quantity >= item.stock}
                                                        className="p-1.5 rounded-lg text-gray-500 hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm disabled:opacity-20 transition-all font-bold"
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </button>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter block mb-0.5">Subtotal</span>
                                                    <span className="text-xl font-black text-gray-900 dark:text-white flex items-center">
                                                        <IndianRupee className="h-4.5 w-4.5 mr-0.5" />
                                                        {(item.price * item.quantity).toFixed(0)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.li>
                                ))}
                            </AnimatePresence>
                        </ul>
                    </section>

                    <section className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 opacity-[0.03] dark:opacity-[0.08] pointer-events-none">
                            <Truck className="h-40 w-40 text-green-500" />
                        </div>
                        <div className="relative">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Delivery Information</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Recipient Name</label>
                                        <p className="text-lg font-bold text-gray-900 dark:text-white">{user?.fullName || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Contact Number</label>
                                        <p className="text-gray-700 dark:text-gray-300 font-medium">📞 {user?.mobileNumber || 'No contact provided'}</p>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Shipping Address</label>
                                    <div className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                                        <MapPin className="h-5 w-5 mt-0.5 text-gray-400 flex-shrink-0" />
                                        <p className="font-medium leading-relaxed italic">
                                            {user?.address || 'Complete your profile to add a permanent address.'}
                                        </p>
                                    </div>
                                    <button onClick={() => navigate('/profile')} className="mt-3 text-xs font-bold text-green-600 dark:text-green-500 hover:text-green-700 transition-colors uppercase tracking-tight underline">
                                        Update Address
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="lg:col-span-4 mt-12 lg:mt-0 sticky top-24">
                    <section className="bg-gray-900 dark:bg-black rounded-3xl p-8 text-white shadow-2xl shadow-green-900/10 border border-gray-800">
                        <h2 className="text-xl font-bold mb-8 flex items-center">
                            <FileText className="h-5 w-5 mr-3 text-green-400" /> Order Summary
                        </h2>

                        <div className="space-y-6">
                            <div className="flex justify-between items-center text-gray-400">
                                <span className="text-sm font-medium">Merchandise Total</span>
                                <span className="font-bold flex items-center text-white">
                                    <IndianRupee className="h-4 w-4 mr-1" />{total.toFixed(0)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-gray-400">
                                <span className="text-sm font-medium">Delivery Charge</span>
                                <span className="font-bold text-green-400 uppercase text-xs tracking-widest">Calculated At Delivery</span>
                            </div>
                            <div className="flex justify-between items-center text-gray-400">
                                <span className="text-sm font-medium">GST / Taxes</span>
                                <span className="font-bold text-white flex items-center">
                                    <IndianRupee className="h-4 w-4 mr-1" />0.00
                                </span>
                            </div>

                            <div className="pt-6 border-t border-gray-800">
                                <div className="flex justify-between items-end mb-1">
                                    <span className="text-sm font-bold text-gray-400">GRAND TOTAL</span>
                                    <span className="text-3xl font-black text-white flex items-center tracking-tighter">
                                        <IndianRupee className="h-7 w-7 mr-1 text-green-400" />
                                        {total.toFixed(0)}
                                    </span>
                                </div>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight text-right">Includes all applyable fees</p>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 bg-rose-900/20 border border-rose-900/50 rounded-2xl text-rose-400 text-xs font-bold flex items-center gap-3"
                                >
                                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                    {error}
                                </motion.div>
                            )}

                            <div className="pt-4 space-y-4">
                                <button
                                    onClick={handleCheckout}
                                    disabled={loading}
                                    className={`w-full py-4 bg-green-500 hover:bg-green-400 text-black font-black text-lg rounded-2xl transition-all shadow-lg shadow-green-500/20 active:scale-95 flex items-center justify-center gap-3 ${loading ? 'opacity-50 cursor-not-allowed grayscale' : ''
                                        }`}
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-3 border-black border-t-transparent"></div>
                                            SECURE PROCESSING...
                                        </>
                                    ) : (
                                        <>
                                            <ShieldCheck className="h-6 w-6" />
                                            PLACE ORDER
                                        </>
                                    )}
                                </button>

                                <div className="flex items-center justify-center gap-4 py-2">
                                    <div className="flex items-center gap-1.5 opacity-30 grayscale saturate-0">
                                        <CreditCard className="h-4 w-4" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">COD Available</span>
                                    </div>
                                    <div className="h-4 w-px bg-gray-800"></div>
                                    <div className="flex items-center gap-1.5 opacity-30 grayscale saturate-0">
                                        <ShieldCheck className="h-4 w-4" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Buyer Protection</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <button
                        onClick={() => navigate('/products')}
                        className="w-full mt-4 flex items-center justify-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-green-600 transition-colors"
                    >
                        <ShoppingBag className="h-4 w-4" /> Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
