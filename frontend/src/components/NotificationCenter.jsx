import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2, Clock, AlertCircle, ShoppingBag, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';

import { useAuth } from '../context/AuthContext';

const NotificationCenter = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const apiBase = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        if (user?.token) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 10000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const fetchNotifications = async () => {
        try {
            if (!user?.token) return;

            const [notifsRes, countRes] = await Promise.all([
                axios.get(`${apiBase}/api/notifications`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                }),
                axios.get(`${apiBase}/api/notifications/unread-count`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                })
            ]);

            setNotifications(notifsRes.data);
            setUnreadCount(countRes.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const markAsRead = async (id) => {
        try {
            if (!user?.token) return;
            await axios.put(`${apiBase}/api/notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            if (!user?.token) return;
            await axios.put(`${apiBase}/api/notifications/read-all`, {}, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'ORDER_NEW': return <ShoppingBag className="h-4 w-4 text-green-500" />;
            case 'ORDER_CONFIRMED': return <Check className="h-4 w-4 text-emerald-500" />;
            case 'ORDER_STATUS_UPDATE': return <Clock className="h-4 w-4 text-blue-500" />;
            case 'ORDER_CANCELLED': return <X className="h-4 w-4 text-red-500" />;
            default: return <AlertCircle className="h-4 w-4 text-amber-500" />;
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
            >
                <Bell className="h-5 w-5" />
                <AnimatePresence>
                    {unreadCount > 0 && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[8px] font-black rounded-full h-4 w-4 flex items-center justify-center border-2 border-white dark:border-gray-900"
                        >
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </motion.span>
                    )}
                </AnimatePresence>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop for closing */}
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setIsOpen(false)}
                        />

                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden"
                        >
                            <div className="p-4 border-b border-gray-50 dark:border-gray-700 flex justify-between items-center">
                                <h3 className="font-bold text-gray-900 dark:text-gray-100">Notifications</h3>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-[10px] font-black uppercase tracking-wider text-green-600 dark:text-green-400 hover:underline"
                                    >
                                        Mark all as read
                                    </button>
                                )}
                            </div>

                            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                {notifications.length > 0 ? (
                                    notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            onClick={() => !notification.read && markAsRead(notification.id)}
                                            className={`p-4 border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer relative group
                                                ${!notification.read ? 'bg-green-50/30 dark:bg-green-900/10' : ''}`}
                                        >
                                            <div className="flex gap-3">
                                                <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 
                                                    ${!notification.read ? 'bg-white dark:bg-gray-800 shadow-sm' : 'bg-gray-100 dark:bg-gray-700'}`}>
                                                    {getIcon(notification.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm leading-tight mb-1 ${!notification.read ? 'font-bold text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                                                        {notification.title}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-500 line-clamp-2">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-1 uppercase font-bold tracking-tighter">
                                                        <Clock className="h-3 w-3" />
                                                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                    </p>
                                                </div>
                                                {!notification.read && (
                                                    <div className="h-2 w-2 rounded-full bg-green-500 mt-1 shrink-0 shadow-glow shadow-green-500/50" />
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center">
                                        <div className="h-12 w-12 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Bell className="h-6 w-6 text-gray-300" />
                                        </div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">All caught up!</p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">No new notifications.</p>
                                    </div>
                                )}
                            </div>

                            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 text-center border-t border-gray-100 dark:border-gray-700">
                                <button className="text-xs font-bold text-gray-400 dark:text-gray-500 hover:text-green-600 transition-colors">
                                    Notification Settings
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationCenter;
