import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, BarChart3, Settings, TrendingUp, DollarSign, Trash2,
    RefreshCcw, ShieldCheck, Mail, Search, Activity, PieChart as PieIcon,
    UserCheck, UserX, ShoppingBag, Package, X, ChevronRight, ArrowUpRight, ArrowDownRight, Clock
} from 'lucide-react';
import axios from 'axios';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ users: 0, products: 0, orders: 0, revenue: 0 });
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('ALL');
    const [showUsers, setShowUsers] = useState(false);

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
                setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
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

    // Real analytics from backend stats and user list
    const revenueTrendData = stats.revenueTrend || [];

    const farmerCount = users.filter(u => u.role?.toUpperCase().includes('FARMER')).length;
    const retailerCount = users.filter(u => u.role?.toUpperCase().includes('RETAILER')).length;

    const distributionData = [
        { name: 'Farmers', value: farmerCount },
        { name: 'Retailers', value: retailerCount },
    ].filter(d => d.value > 0);

    // If no users yet, show a placeholder for the pie chart to avoid empty circles
    const pieData = distributionData.length > 0 ? distributionData : [{ name: 'No Nodes', value: 1 }];

    const COLORS = ['#10b981', '#3b82f6'];

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/admin/users/${userId}`, authConfig);
                setRefreshTrigger(prev => prev + 1);
            } catch (error) {
                console.error("Error deleting user:", error);
                alert("Failed to delete user");
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

    const filteredUsers = users.filter(u => {
        const matchesSearch =
            (u.fullName || u.username || u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (u.mobileNumber || '').includes(searchTerm);

        const userRole = (u.role || '').toString().toUpperCase();
        const matchesRole = filterRole === 'ALL' || userRole.includes(filterRole);

        return matchesSearch && matchesRole;
    });

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

    const getRoleStyle = (role) => {
        switch (role) {
            case 'ADMIN': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800/50';
            case 'FARMER': return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50';
            case 'RETAILER': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/50';
            default: return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700';
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'APPROVED': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/50';
            case 'REJECTED': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50';
            default: return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50';
        }
    };

    if (loading && refreshTrigger === 0) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[70vh]">
                <div className="relative h-24 w-24">
                    <div className="absolute inset-0 rounded-full border-4 border-green-100 dark:border-green-900/20"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-green-500 border-t-transparent animate-spin"></div>
                    <ShieldCheck className="absolute inset-0 m-auto h-10 w-10 text-green-500" />
                </div>
                <p className="mt-6 text-gray-500 dark:text-gray-400 font-bold uppercase tracking-[0.2em] animate-pulse">Synchronizing Data...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors">
            {/* Header Section */}
            <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2.5 bg-green-100 dark:bg-green-900/30 rounded-2xl ring-1 ring-green-200 dark:ring-green-800/50 shadow-sm">
                            <ShieldCheck className="h-7 w-7 text-green-600 dark:text-green-400" />
                        </div>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Platform Command Center</h1>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 max-w-2xl font-medium">
                        Welcome, <span className="text-green-600 dark:text-green-400 font-bold">Admin {user.username}</span>. Global oversight, analytics and participant management.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Protocol Status</p>
                        <p className="text-xs font-bold text-green-500 flex items-center justify-end gap-1.5">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Active Nodes
                        </p>
                    </div>
                    <button
                        onClick={() => setRefreshTrigger(prev => prev + 1)}
                        className="p-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all active:scale-95 group"
                    >
                        <RefreshCcw size={20} className={`text-gray-500 group-hover:text-green-500 transition-colors ${loading ? "animate-spin" : ""}`} />
                    </button>
                </div>
            </header>

            {/* Stats Overview */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            >
                {[
                    { label: 'Platform Users', value: stats.users, icon: Users, color: 'sky', labelSmall: 'Network Growth' },
                    { label: 'Active Products', value: stats.products, icon: Package, color: 'emerald', labelSmall: 'Global Inventory' },
                    { label: 'Total Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: DollarSign, color: 'orange', labelSmall: 'Financial Flow' },
                    { label: 'Orders Fulfilled', value: stats.orders, icon: ShoppingBag, color: 'purple', labelSmall: 'Trading Activity' }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        variants={itemVariants}
                        className="group relative bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-50 dark:border-gray-700 overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1"
                    >
                        <div className={`absolute top-0 right-0 p-8 opacity-[0.03] dark:opacity-[0.08] -mr-8 -mt-8 pointer-events-none transition-transform group-hover:scale-110`}>
                            <stat.icon className="h-32 w-32" />
                        </div>
                        <div className="relative">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 bg-${stat.color}-50 dark:bg-${stat.color}-900/20 rounded-2xl ring-1 ring-inset ring-${stat.color}-100 dark:ring-${stat.color}-900/50`}>
                                    <stat.icon className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                                </div>
                                <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{stat.labelSmall}</span>
                            </div>
                            <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{stat.value}</h3>
                            <div className="flex items-center justify-between mt-1">
                                <p className="text-sm font-bold text-gray-500 dark:text-gray-400">{stat.label}</p>
                                {stat.icon === Users && (
                                    <button
                                        onClick={() => setShowUsers(!showUsers)}
                                        className={`text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md transition-colors ${showUsers
                                            ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                                            : 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                                            }`}
                                    >
                                        {showUsers ? 'Hide List' : 'Show List'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Graphs Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                {/* Revenue Graph */}
                <motion.div variants={itemVariants} className="lg:col-span-2 bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Revenue Analytics</h3>
                            <p className="text-sm text-gray-500 font-medium">Weekly financial growth trajectory</p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl text-xs font-black uppercase tracking-widest">
                            <TrendingUp size={14} /> +12.5%
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueTrendData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888888', fontWeight: 'bold' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888888', fontWeight: 'bold' }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#111827', borderRadius: '16px', border: 'none', color: '#fff' }}
                                    itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Role Distribution Pie Chart */}
                <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight mb-8">Platform Identity</h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#111827', borderRadius: '16px', border: 'none', color: '#fff' }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-8 space-y-4">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500 font-bold">Farmer Nodes</span>
                            <span className="text-emerald-600 font-black">{Math.round((farmerCount / stats.users) * 100) || 40}%</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500 font-bold">Retailer Nodes</span>
                            <span className="text-blue-600 font-black">{Math.round((retailerCount / stats.users) * 100) || 60}%</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                {/* User LIST Section */}
                <div className="lg:col-span-3 space-y-6">
                    {!showUsers ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between group transition-all hover:shadow-md border-l-4 border-l-green-500"
                        >
                            <div className="flex items-center gap-6">
                                <div className="h-16 w-16 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Identity Management System</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium tracking-tight">Perform global CRUD operations on system participants.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowUsers(true)}
                                className="px-8 py-4 bg-gray-900 dark:bg-green-600 text-white font-black text-xs rounded-2xl transition-all shadow-lg hover:shadow-green-500/20 active:scale-95 uppercase tracking-widest flex items-center gap-3"
                            >
                                <Search size={16} /> Open Directory
                            </button>
                        </motion.div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="relative flex-grow max-w-md">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by name, email or number..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-green-500 transition-all outline-none text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-1.5 rounded-2xl border border-gray-100 dark:border-gray-700">
                                    {['ALL', 'FARMER', 'RETAILER'].map(role => (
                                        <button
                                            key={role}
                                            onClick={() => setFilterRole(role)}
                                            className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterRole === role
                                                ? 'bg-green-600 text-white shadow-lg shadow-green-600/20'
                                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                                }`}
                                        >
                                            {role}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setShowUsers(false)}
                                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                                        title="Close Directory"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-50 dark:border-gray-700 overflow-hidden transition-colors">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700">
                                        <thead>
                                            <tr className="bg-gray-50/50 dark:bg-gray-700/30">
                                                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Platform Identity</th>
                                                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Designation</th>
                                                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Account Status</th>
                                                <th className="px-8 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Operational Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                            <AnimatePresence mode="popLayout">
                                                {filteredUsers.map((u) => (
                                                    <motion.tr
                                                        key={u.id}
                                                        layout
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors group"
                                                    >
                                                        <td className="px-8 py-5 whitespace-nowrap">
                                                            <div className="flex items-center gap-4">
                                                                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-green-500/10">
                                                                    {(u.fullName || u.username || u.email || '?').charAt(0).toUpperCase()}
                                                                </div>
                                                                <div>
                                                                    <div className="text-sm font-black text-gray-900 dark:text-gray-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                                                                        {u.fullName || u.username || u.name || 'Anonymous User'}
                                                                    </div>
                                                                    <div className="text-xs text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1">
                                                                        <Mail className="h-3 w-3" /> {u.email || 'No email provided'}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-5 whitespace-nowrap">
                                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-widest ${getRoleStyle(u.role)}`}>
                                                                {u.role}
                                                            </span>
                                                        </td>
                                                        <td className="px-8 py-5 whitespace-nowrap">
                                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-widest ${getStatusStyle(u.status)}`}>
                                                                {u.status || 'PENDING'}
                                                            </span>
                                                        </td>
                                                        <td className="px-8 py-5 whitespace-nowrap text-right space-x-2">
                                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                                                {u.role !== 'ADMIN' && (
                                                                    <>
                                                                        {u.status !== 'APPROVED' && (
                                                                            <button
                                                                                onClick={() => handleUpdateStatus(u.id, 'APPROVED')}
                                                                                className="p-2 bg-green-50 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm"
                                                                                title="Approve"
                                                                            >
                                                                                <UserCheck size={16} />
                                                                            </button>
                                                                        )}
                                                                        {u.status !== 'REJECTED' && (
                                                                            <button
                                                                                onClick={() => handleUpdateStatus(u.id, 'REJECTED')}
                                                                                className="p-2 bg-rose-50 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                                                                                title="Reject"
                                                                            >
                                                                                <UserX size={16} />
                                                                            </button>
                                                                        )}
                                                                        <button
                                                                            onClick={() => handleDeleteUser(u.id)}
                                                                            className="p-2 bg-gray-50 dark:bg-gray-700 text-gray-400 dark:text-gray-400 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                                            title="Delete"
                                                                        >
                                                                            <Trash2 size={16} />
                                                                        </button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </motion.tr>
                                                ))}
                                            </AnimatePresence>
                                        </tbody>
                                    </table>
                                </div>
                                {filteredUsers.length === 0 && (
                                    <div className="p-12 text-center">
                                        <Activity className="h-12 w-12 text-gray-200 dark:text-gray-700 mx-auto mb-4" />
                                        <p className="text-gray-500 dark:text-gray-400 font-bold">No matching agents found in current sector</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar Controls & Activity Table */}
                <div className="space-y-8">
                    {/* System Activity Table (The "New Table") */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600">
                                <Clock className="h-5 w-5" />
                            </div>
                            <h3 className="text-lg font-black tracking-tight text-gray-900 dark:text-white">Recent Activity</h3>
                        </div>
                        <div className="space-y-4">
                            {(stats.recentActivity || []).length > 0 ? (
                                stats.recentActivity.map((activity, i) => (
                                    <div key={i} className="flex items-center gap-4 group transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 rounded-2xl">
                                        <div className={`h-10 w-10 flex-shrink-0 rounded-full flex items-center justify-center text-xs font-black ${activity.type === 'FARMER' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                                            }`}>
                                            {activity.user.charAt(0)}
                                        </div>
                                        <div className="flex-grow overflow-hidden">
                                            <p className="text-xs font-black text-gray-900 dark:text-gray-100 truncate">{activity.action}</p>
                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">{activity.user} • {activity.time}</p>
                                        </div>
                                        <ArrowUpRight size={14} className="text-gray-300 group-hover:text-green-500 transition-colors" />
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-gray-400 text-center py-4">No recent activity detected</p>
                            )}
                        </div>
                        <button className="w-full mt-6 py-3 text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest hover:text-green-600 transition-colors">
                            View Server Logs
                        </button>
                    </div>

                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-green-900 dark:to-green-950 p-6 rounded-3xl shadow-xl text-white">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-white/10 rounded-xl">
                                <Activity className="h-5 w-5 text-green-400" />
                            </div>
                            <h3 className="text-lg font-black tracking-tight">System Intel</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Efficiency</span>
                                    <span className="text-sm font-black">94.8%</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 rounded-full w-[94.8%]"></div>
                                </div>
                            </div>
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Server Load</span>
                                    <span className="text-sm font-black text-orange-400">Moderated</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-orange-500 rounded-full w-[65%]"></div>
                                </div>
                            </div>
                        </div>
                        <button className="w-full mt-6 py-3 bg-green-500 hover:bg-green-400 text-black font-black text-xs rounded-2xl transition-all shadow-lg shadow-green-500/20 active:scale-95 flex items-center justify-center gap-2">
                            <PieIcon size={14} /> EXPORT ANALYTICS
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
