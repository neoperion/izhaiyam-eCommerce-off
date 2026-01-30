import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  Image
} from 'lucide-react';

export const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toastSuccess, toastError } = useToast();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: ShoppingCart, label: 'Orders', path: '/admin/orders-Management' },
    { icon: Package, label: 'Products', path: '/admin/products' },
    { icon: Users, label: 'Customers', path: '/admin/user-Management' },
    { icon: Image, label: 'Gallery', path: '/admin/instagram-gallery' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' }
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await localStorage.clear("userData");
      toastSuccess("User has successfully logged out");
      navigate("/login");
    } catch (error) {
      toastError("Something went wrong");
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar - Fixed Left */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 z-50 transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0`}
        style={{ width: '260px' }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">I</span>
            </div>
            <span className="font-bold text-gray-900">Izhaiyam Admin</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive(item.path)
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
