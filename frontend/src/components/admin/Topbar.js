import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Menu, User, CheckCircle, AlertTriangle, AlertOctagon, Info, Clock } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { useSocket } from '../../context/SocketContext'; // Import hook

export const Topbar = ({ toggleSidebar }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const socket = useSocket(); // Get socket instance

  const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";

  const fetchNotifications = async () => {
      try {
          const userData = JSON.parse(localStorage.getItem("UserData"));
          if (!userData || !userData.loginToken) return;

          const { data } = await axios.get(`${serverUrl}/api/v1/admin/notifications`, {
              headers: { authorization: `Bearer ${userData.loginToken}` }
          });
          setNotifications(data.notifications.slice(0, 5)); // Top 5
          setUnreadCount(data.unreadCount);
      } catch (error) {
          console.error("Failed to fetch notifications");
      }
  };

  useEffect(() => {
      fetchNotifications();
      
      if (socket) {
          socket.on("notification:new", (newNotification) => {
              // Play sound or show toast?
              setNotifications(prev => [newNotification, ...prev].slice(0, 5));
              setUnreadCount(prev => prev + 1);
          });
          // ... rest of socket logic
          
          socket.on("notification:markAllRead", () => {
             setNotifications(prev => prev.map(n => ({...n, isRead: true})));
             setUnreadCount(0);
          });

          socket.on("notification:clearAll", () => {
             setNotifications([]);
             setUnreadCount(0);
          });
      }

      return () => {
          if (socket) {
              socket.off("notification:new");
              socket.off("notification:markAllRead");
              socket.off("notification:clearAll");
          }
      };
  }, [socket]);

  // Close dropdown when clicking outside
  useEffect(() => {
      const handleClickOutside = (event) => {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
              setShowDropdown(false);
          }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = async (id) => {
      try {
           const userData = JSON.parse(localStorage.getItem("UserData"));
           await axios.patch(`${serverUrl}/api/v1/admin/notifications/${id}/read`, {}, {
               headers: { authorization: `Bearer ${userData.loginToken}` }
           });
           fetchNotifications(); // Refresh
           navigate('/admin/notifications');
           setShowDropdown(false);
      } catch (error) {
           console.error("Failed to mark read");
      }
  };

  const getIcon = (type) => {
        switch(type) {
            case 'error': return <AlertOctagon className="text-red-500" size={16} />;
            case 'warning': return <AlertTriangle className="text-amber-500" size={16} />;
            case 'info': default: return <Info className="text-blue-500" size={16} />;
        }
  };

  return (
    <header 
      className="bg-white border-b sticky top-0 flex items-center justify-between"
      style={{
        borderColor: '#e5e7eb',
        padding: '20px 30px',
        zIndex: 50
      }}
    >
      <div className="w-full flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu size={20} />
          </button>

          <div className="text-lg font-semibold text-gray-900 hidden lg:block">
            Good morning, Admin
          </div>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-xl mx-4">
          <div className="relative w-full">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders, products, customers..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          
          {/* Notification Bell */}
          <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
               >
                <Bell size={20} className="text-gray-600" />
                {unreadCount > 0 && (
                     <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white">
                        {unreadCount > 99 ? '99+' : unreadCount}
                     </span>
                )}
              </button>

              {/* Dropdown */}
              {showDropdown && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-[100]">
                      <div className="p-3 border-b flex justify-between items-center bg-gray-50">
                          <h3 className="font-semibold text-gray-700">Notifications</h3>
                          <button 
                             onClick={() => { navigate('/admin/notifications'); setShowDropdown(false); }}
                             className="text-xs text-emerald-600 font-medium hover:underline"
                          >
                              View All
                          </button>
                      </div>
                      <div className="max-h-[300px] overflow-y-auto">
                          {notifications.length === 0 ? (
                              <div className="p-4 text-center text-gray-500 text-sm">No notifications</div>
                          ) : (
                              notifications.map((n) => (
                                  <div 
                                    key={n._id} 
                                    onClick={() => handleNotificationClick(n._id)}
                                    className={`p-3 border-b hover:bg-gray-50 cursor-pointer flex gap-3 ${!n.isRead ? 'bg-emerald-50/30' : ''}`}
                                  >
                                      <div className="mt-1">{getIcon(n.type)}</div>
                                      <div>
                                          <p className={`text-sm ${!n.isRead ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>
                                              {n.title}
                                          </p>
                                          <p className="text-xs text-gray-500 line-clamp-2">{n.message}</p>
                                          <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                                             <Clock size={10} /> {new Date(n.createdAt).toLocaleTimeString()}
                                          </p>
                                      </div>
                                  </div>
                              ))
                          )}
                      </div>
                  </div>
              )}
          </div>

          <div className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-semibold text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">admin@izhaiyam.com</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
