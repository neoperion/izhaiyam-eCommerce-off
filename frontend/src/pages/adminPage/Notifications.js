import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import AdminLayout from '../../components/admin/AdminLayout';
import { Bell, CheckCircle, AlertTriangle, AlertOctagon, Info, Clock, Trash2 } from 'lucide-react';

import { useSocket } from '../../context/SocketContext'; // Import hook

const NotificationsProtocol = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const socket = useSocket();

    const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const LoginToken = JSON.parse(localStorage.getItem("UserData")).loginToken || " ";
                const { data } = await axios.get(`${serverUrl}/api/v1/admin/notifications`, {
                    headers: { authorization: `Bearer ${LoginToken}` }
                });
                setNotifications(data.notifications);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch notifications", error);
                setLoading(false);
            }
        };

        fetchNotifications();
        
        if (socket) {
            socket.on("notification:new", (newNotification) => {
                setNotifications(prev => [newNotification, ...prev]);
            });

            socket.on("notification:update", (updatedNotification) => {
                setNotifications(prev => prev.map(n => n._id === updatedNotification._id ? updatedNotification : n));
            });

            socket.on("notification:delete", (deletedId) => {
                setNotifications(prev => prev.filter(n => n._id !== deletedId));
            });
            
             socket.on("notification:markAllRead", () => {
                 setNotifications(prev => prev.map(n => ({...n, isRead: true})));
            });

            socket.on("notification:clearAll", () => {
                 setNotifications([]);
            });
        }
        
        return () => {
            if (socket) {
                socket.off("notification:new");
                socket.off("notification:update");
                socket.off("notification:delete");
                socket.off("notification:markAllRead");
                socket.off("notification:clearAll");
            }
        };
    }, [socket, serverUrl]);

    const markAsRead = async (id) => {
        try {
             const LoginToken = JSON.parse(localStorage.getItem("UserData")).loginToken || " ";
             await axios.patch(`${serverUrl}/api/v1/admin/notifications/${id}/read`, {}, {
                 headers: { authorization: `Bearer ${LoginToken}` }
             });
             
             // Optimistic Update
             setNotifications(prev => prev.map(n => n._id === id ? {...n, isRead: true} : n));
             
        } catch (error) {
             toast.error("Failed to update status");
        }
    };

    const deleteNotification = async (id) => {
        try {
             const LoginToken = JSON.parse(localStorage.getItem("UserData")).loginToken || " ";
             await axios.delete(`${serverUrl}/api/v1/admin/notifications/${id}`, {
                 headers: { authorization: `Bearer ${LoginToken}` }
             });
             
             // Optimistic Update
             setNotifications(prev => prev.filter(n => n._id !== id));
             toast.success("Notification deleted");
             
        } catch (error) {
             toast.error("Failed to delete notification");
        }
    };

    const clearAllNotifications = async () => {
        if(!window.confirm("Are you sure you want to clear ALL notifications?")) return;

        try {
             const LoginToken = JSON.parse(localStorage.getItem("UserData")).loginToken || " ";
             await axios.delete(`${serverUrl}/api/v1/admin/notifications/all`, {
                 headers: { authorization: `Bearer ${LoginToken}` }
             });
             
             setNotifications([]);
             toast.success("All notifications cleared");
             
        } catch (error) {
             toast.error("Failed to clear notifications");
        }
    };

    const markAllAsRead = async () => {
        try {
             const LoginToken = JSON.parse(localStorage.getItem("UserData")).loginToken || " ";
             await axios.patch(`${serverUrl}/api/v1/admin/notifications/all/read`, {}, {
                 headers: { authorization: `Bearer ${LoginToken}` }
             });
             
             setNotifications(prev => prev.map(n => ({...n, isRead: true})));
             toast.success("All marked as read");
             
        } catch (error) {
             toast.error("Failed to update status");
        }
    };

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'all') return true;
        if (filter === 'unread') return !n.isRead;
        return n.type === filter;
    });

    const getIcon = (type) => {
        switch(type) {
            case 'error': return <AlertOctagon className="text-red-500" size={24} />;
            case 'warning': return <AlertTriangle className="text-amber-500" size={24} />;
            case 'info': default: return <Info className="text-blue-500" size={24} />;
        }
    };

    const getBgColor = (type) => {
        switch(type) {
            case 'error': return 'bg-red-50 border-red-200';
            case 'warning': return 'bg-amber-50 border-amber-200';
            case 'info': default: return 'bg-blue-50 border-blue-200';
        }
    };

    return (
        <AdminLayout>
            <div className="p-6 max-w-5xl mx-auto w-full">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
                        <Bell className="text-emerald-600" /> Notifications
                    </h1>
                    <div className="flex gap-2">
                        <button 
                            onClick={markAllAsRead}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                        >
                            <CheckCircle size={16} /> Mark all read
                        </button>
                        <button 
                            onClick={clearAllNotifications}
                            className="px-4 py-2 bg-red-50 border border-red-200 text-red-600 rounded-lg shadow-sm text-sm font-medium hover:bg-red-100 transition-colors flex items-center gap-2"
                        >
                            <Trash2 size={16} /> Clear all
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {['all', 'unread', 'error', 'warning', 'info'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors
                                ${filter === f 
                                    ? 'bg-emerald-600 text-white shadow-md' 
                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'}
                            `}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* List */}
                {loading ? (
                    <div className="text-center py-12 text-gray-500">Loading notifications...</div>
                ) : filteredNotifications.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                        <CheckCircle className="mx-auto mb-2 text-gray-300" size={48} />
                        <p>No notifications found</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredNotifications.map(notification => (
                            <div 
                                key={notification._id}
                                className={`relative p-4 rounded-xl border transition-all duration-200 group ${notification.isRead ? 'bg-white border-gray-200 opacity-75' : 'bg-white border-emerald-200 shadow-sm border-l-4 border-l-emerald-500'}`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`p-2 rounded-lg ${getBgColor(notification.type)}`}>
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className={`font-semibold text-lg ${notification.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                                                {notification.title}
                                            </h3>
                                            <span className="text-xs text-gray-400 flex items-center gap-1 whitespace-nowrap ml-2">
                                                <Clock size={12} />
                                                {new Date(notification.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 mt-1 text-sm leading-relaxed">
                                            {notification.message}
                                        </p>
                                        <div className="flex gap-4 mt-3">
                                            {!notification.isRead && (
                                                <button 
                                                    onClick={() => markAsRead(notification._id)}
                                                    className="text-xs font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                                                >
                                                    <CheckCircle size={12} /> Mark as read
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    {/* Delete Button */}
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); deleteNotification(notification._id); }}
                                        className="text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Delete notification"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default NotificationsProtocol;
