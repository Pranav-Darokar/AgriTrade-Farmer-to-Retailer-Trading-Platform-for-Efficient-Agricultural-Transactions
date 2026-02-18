
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Users, BarChart3, Settings, TrendingUp, DollarSign, Trash2, RefreshCcw } from 'lucide-react';
import axios from 'axios';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ users: 0, products: 0, orders: 0, revenue: 0 });
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const token = user?.token;

    const authConfig = {
        headers: { Authorization: `Bearer ${token}` }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [statsRes, usersRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/stats`, authConfig),
                    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/users`, authConfig)
                ]);

                setStats(statsRes.data);
                setUsers(usersRes.data);
            } catch (error) {
                console.error("Error fetching admin data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchData();
        }
    }, [token, refreshTrigger]);

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/admin/users/${userId}`, authConfig);
                setRefreshTrigger(prev => prev + 1); // Refresh data
            } catch (error) {
                console.error("Error deleting user:", error);
                if (error.response) {
                    console.error("Delete Error Response:", error.response.data);
                    alert(`Failed to delete user: ${error.response.data.message || JSON.stringify(error.response.data)}`);
                } else {
                    alert("Failed to delete user");
                }
            }
        }
    };

    const handleUpdateStatus = async (userId, status) => {
        try {
            await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/admin/users/${userId}/status`, { status }, authConfig);
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            console.error("Error updating user status:", error);
            alert("Failed to update user status");
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Admin Dashboard
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Welcome back, <span className="text-green-600 font-semibold">{user?.username}</span>. Manage the platform here.
                    </p>
                </div>
                <button
                    onClick={() => setRefreshTrigger(prev => prev + 1)}
                    className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                    title="Refresh Data"
                >
                    <RefreshCcw size={20} className={loading ? "animate-spin text-gray-600" : "text-gray-600"} />
                </button>
            </div>

            {loading && <div className="text-center py-4">Loading dashboard data...</div>}

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
            >
                {/* Stats Cards */}
                <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-md border-l-4 border-indigo-500">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Users</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.users}</p>
                        </div>
                        <div className="p-3 bg-indigo-100 rounded-full">
                            <Users className="h-6 w-6 text-indigo-600" />
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Products</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.products}</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full">
                            <BarChart3 className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-md border-l-4 border-emerald-500">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                            <p className="text-2xl font-bold text-gray-900">₹{stats.revenue}</p>
                        </div>
                        <div className="p-3 bg-emerald-100 rounded-full">
                            <DollarSign className="h-6 w-6 text-emerald-600" />
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Orders</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.orders}</p>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-full">
                            <TrendingUp className="h-6 w-6 text-purple-600" />
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Management Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* User LIST */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden lg:col-span-2">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                            <Users className="mr-2 h-5 w-5 text-gray-500" />
                            User Management
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map((u) => (
                                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">
                                                    {u.fullName ? u.fullName.charAt(0).toUpperCase() : u.email.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{u.fullName}</div>
                                                    <div className="text-sm text-gray-500">{u.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                                                u.role === 'FARMER' ? 'bg-green-100 text-green-800' :
                                                    'bg-blue-100 text-blue-800'
                                                }`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                                u.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {u.status || 'PENDING'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {u.mobileNumber || u.contactInfo}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            {u.role !== 'ADMIN' && (
                                                <>
                                                    {u.status !== 'APPROVED' && (
                                                        <button
                                                            onClick={() => handleUpdateStatus(u.id, 'APPROVED')}
                                                            className="text-green-600 hover:text-green-900 bg-green-50 p-2 rounded-full hover:bg-green-100 transition-colors"
                                                            title="Approve User"
                                                        >
                                                            <div className="h-4 w-4">✓</div>
                                                        </button>
                                                    )}
                                                    {u.status !== 'REJECTED' && (
                                                        <button
                                                            onClick={() => handleUpdateStatus(u.id, 'REJECTED')}
                                                            className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-full hover:bg-red-100 transition-colors"
                                                            title="Reject User"
                                                        >
                                                            <div className="h-4 w-4">✕</div>
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDeleteUser(u.id)}
                                                        className="text-gray-400 hover:text-red-600 p-2 transition-colors"
                                                        title="Delete User"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions / Future Expansion */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="p-3 bg-orange-50 rounded-lg">
                                <BarChart3 className="h-6 w-6 text-orange-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">System Reports</h3>
                        </div>
                        <p className="text-gray-500 text-sm mb-4">Generate detailed reports of platform activity.</p>
                        <button className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none transition-colors">
                            Download Report
                        </button>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <Settings className="h-6 w-6 text-gray-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Platform Settings</h3>
                        </div>
                        <p className="text-gray-500 text-sm mb-4">Configure general platform settings.</p>
                        <button className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors">
                            Manage Settings
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
