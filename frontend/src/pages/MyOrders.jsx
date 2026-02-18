import { useState, useEffect } from 'react';
import OrderService from '../services/OrderService';
import { useAuth } from '../context/AuthContext';
import { Package, Clock, Calendar, User, IndianRupee } from 'lucide-react';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();
    const isFarmer = user?.roles.includes('FARMER');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = isFarmer
                ? await OrderService.getFarmerOrders()
                : await OrderService.getMyOrders();
            setOrders(data);
        } catch (err) {
            console.error(err);
            setError('Failed to load orders.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
                {isFarmer ? 'Incoming Orders' : 'My Orders'}
            </h1>

            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
                    {error}
                </div>
            )}

            {orders.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
                    <Package className="mx-auto h-16 w-16 text-gray-300" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No orders found</h3>
                    <p className="mt-1 text-gray-500">
                        {isFarmer ? "You haven't received any orders yet." : "You haven't placed any orders yet."}
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center text-gray-500">
                                        <Calendar className="h-5 w-5 mr-2" />
                                        <span className="text-sm font-medium">
                                            {new Date(order.orderDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-gray-500">
                                        <Clock className="h-5 w-5 mr-2" />
                                        <span className="text-sm font-medium">
                                            {new Date(order.orderDate).toLocaleTimeString()}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                        order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                        {order.status}
                                    </span>
                                    <div className="text-lg font-bold text-gray-900 flex items-center">
                                        <IndianRupee className="h-5 w-5 text-green-600" />
                                        {order.totalAmount}
                                    </div>
                                </div>
                            </div>

                            {isFarmer && (
                                <div className="px-6 py-2 bg-blue-50 border-b border-blue-100 flex items-center text-sm text-blue-700">
                                    <User className="h-4 w-4 mr-2" />
                                    Ordered by: {order.retailer?.username || 'Unknown Retailer'}
                                    <span className="mx-2">|</span>
                                    Contact: {order.retailer?.contactInfo || 'N/A'}
                                </div>
                            )}

                            <div className="px-6 py-4">
                                <h4 className="text-sm font-medium text-gray-500 mb-3">Items</h4>
                                <ul className="divide-y divide-gray-200">
                                    {order.items.map((item) => (
                                        <li key={item.id} className="py-3 flex justify-between items-center">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                                    <Package className="h-5 w-5" />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{item.product?.name || 'Unknown Product'}</div>
                                                    <div className="text-sm text-gray-500 flex items-center">
                                                        Qty: {item.quantity} x <IndianRupee className="h-3 w-3 inline" />{item.pricePerUnit}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-sm font-medium text-gray-900 flex items-center">
                                                <IndianRupee className="h-3 w-3" />
                                                {(item.quantity * item.pricePerUnit).toFixed(2)}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrders;
