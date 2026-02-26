import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, IndianRupee } from 'lucide-react';
import OrderService from '../services/OrderService';
import { useState } from 'react';

const Cart = () => {
    const { cart, total, removeFromCart, updateQuantity, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleCheckout = async () => {
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
            setTimeout(() => {
                navigate('/my-orders');
            }, 2000);
        } catch (err) {
            console.error(err);
            setError('Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0 && !success) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center transition-colors">
                <ShoppingBag className="mx-auto h-24 w-24 text-gray-300 dark:text-gray-600 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">Your cart is empty</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8 transition-colors">Looks like you haven't added any products yet.</p>
                <button
                    onClick={() => navigate('/products')}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 transition-colors"
                >
                    Start Shopping
                </button>
            </div>
        );
    }

    if (success) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center transition-colors">
                <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 dark:bg-green-900/30 mb-4 transition-colors">
                    <ShoppingBag className="h-12 w-12 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">Order Placed Successfully!</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8 transition-colors">Thank you for your purchase. Redirecting to your orders...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 transition-colors">Shopping Cart</h1>

            <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
                <section className="lg:col-span-7">
                    <ul role="list" className="border-t border-b border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700 transition-colors">
                        {cart.map((item) => (
                            <li key={item.id} className="flex py-6 sm:py-10">
                                <div className="flex-shrink-0">
                                    <div className="h-24 w-24 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center transition-colors">
                                        {item.imageUrl ? (
                                            <img
                                                src={item.imageUrl}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "https://via.placeholder.com/96x96?text=No+Image";
                                                }}
                                            />
                                        ) : (
                                            <ShoppingBag className="h-10 w-10 text-gray-400 dark:text-gray-500" />
                                        )}
                                    </div>
                                </div>

                                <div className="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
                                    <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                                        <div>
                                            <div className="flex justify-between">
                                                <h3 className="text-sm">
                                                    <span className="font-medium text-gray-700 dark:text-gray-200 hover:text-gray-800 dark:hover:text-white transition-colors">
                                                        {item.name}
                                                    </span>
                                                </h3>
                                            </div>
                                            <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center transition-colors">
                                                <IndianRupee className="h-4 w-4" />
                                                {item.price}
                                            </p>
                                        </div>

                                        <div className="mt-4 sm:mt-0 sm:pr-9">
                                            <div className="flex items-center space-x-3">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="p-1 rounded-full text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </button>
                                                <span className="text-gray-900 dark:text-white font-medium transition-colors">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="p-1 rounded-full text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </button>
                                            </div>

                                            <div className="absolute top-0 right-0">
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="-m-2 p-2 inline-flex text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 transition-colors"
                                                >
                                                    <span className="sr-only">Remove</span>
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex text-sm text-gray-700 dark:text-gray-300 space-x-2 items-center transition-colors">
                                        <span>Total: </span>
                                        <span className="flex items-center font-medium text-gray-900 dark:text-white">
                                            <IndianRupee className="h-4 w-4" />
                                            {(item.price * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>

                <section
                    aria-labelledby="summary-heading"
                    className="mt-16 bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-5 border border-gray-100 dark:border-gray-700 transition-colors"
                >
                    <h2 id="summary-heading" className="text-lg font-medium text-gray-900 dark:text-white transition-colors">
                        Order summary
                    </h2>

                    <dl className="mt-6 space-y-4">
                        <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4 transition-colors">
                            <dt className="text-base font-medium text-gray-900 dark:text-white transition-colors">Order total</dt>
                            <dd className="text-base font-medium text-gray-900 dark:text-white flex items-center transition-colors">
                                <IndianRupee className="h-4 w-4" />
                                {total.toFixed(2)}
                            </dd>
                        </div>
                    </dl>

                    {error && (
                        <div className="mt-4 text-sm text-red-600 dark:text-red-400 transition-colors">
                            {error}
                        </div>
                    )}

                    <div className="mt-6">
                        <button
                            onClick={handleCheckout}
                            disabled={loading}
                            className={`w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-900 focus:ring-green-500 transition-all ${loading ? 'opacity-75 cursor-not-allowed' : ''
                                }`}
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </span>
                            ) : (
                                <>
                                    Checkout <ArrowRight className="ml-2 h-5 w-5" />
                                </>
                            )}
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Cart;
