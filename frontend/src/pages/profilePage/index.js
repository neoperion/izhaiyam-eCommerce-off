import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { User, MapPin, Package, Settings, LogOut, Home, ArrowRight } from "lucide-react";
import { toast } from "react-toastify";
import { isTokenValidBeforeHeadingToRoute } from "../../utils/isTokenValidBeforeHeadingToARoute";
import { FullpageSpinnerLoader } from "../../components/loaders/spinnerIcon";
import FooterSection from "../../components/footerSection";

export const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { isTokenValidLoader, userData } = useSelector((state) => state.userAuth);

  // check if user is authorized to view the page
  useEffect(() => {
    isTokenValidBeforeHeadingToRoute(dispatch, navigate);
  }, [dispatch, navigate]);

  const menuItems = [
    { id: 'accountInformation', label: 'Account Information', icon: User, path: '/profilePage/accountInformation' },
    { id: 'address', label: 'Addresses', icon: MapPin, path: '/profilePage/address' },
    { id: 'myOrders', label: 'Orders', icon: Package, path: '/profilePage/myOrders' },
    { id: 'accountSettings', label: 'Account Settings', icon: Settings, path: '/profilePage/accountSettings' },
  ];

  const logoutBtnClick = async () => {
    try {
      await localStorage.clear("userData");

      toast("User has successfully logged out", {
        type: "success",
        autoClose: 3000,
        position: "top-center",
      });
      navigate("/login");
    } catch (error) {
      toast("Something went wrong", {
        type: "error",
        autoClose: 3000,
        position: "top-center",
      });
    }
  };

  const getInitials = () => {
    if (userData?.username) {
      const names = userData.username.split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return userData.username.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const getActiveTab = () => {
    const currentPath = location.pathname;
    const activeItem = menuItems.find(item => currentPath.includes(item.id));
    return activeItem?.label || 'Dashboard';
  };

  if (isTokenValidLoader) {
    return <FullpageSpinnerLoader />;
  }

  return (
    <>
      {/* Breadcrumb */}
      <div className="mt-12 w-full bg-sage-50 border-b border-sage-200">
        <div className="container-page py-4">
          <div className="flex items-center gap-2 text-sm text-sage-700">
            <button onClick={() => navigate("/")} className="hover:text-sage-900 transition-colors">
              Home
            </button>
            <ArrowRight className="w-4 h-4" />
            <span className="text-sage-900 font-medium">My Account</span>
          </div>
        </div>
      </div>

      {/* Main Profile Layout */}
      <div className="min-h-screen bg-cream-50">
        <div className="flex">
          {/* Sidebar */}
          <aside className="hidden lg:block w-80 min-h-screen bg-white border-r border-sage-200 sticky top-0 overflow-y-auto">
            <div className="p-6">
              {/* User Profile Section */}
              <div className="mb-8 pb-6 border-b border-sage-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-sage-100 flex items-center justify-center text-sage-700 text-2xl font-playfair font-bold">
                    {getInitials()}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-playfair font-bold text-sage-900">{userData?.username || 'User'}</h2>
                    <p className="text-sm text-sage-600 truncate">{userData?.email || ''}</p>
                  </div>
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname.includes(item.id);
                  
                  return (
                    <Link
                      key={item.id}
                      to={item.path}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 $
                        isActive
                          ? 'bg-sage-600 text-cream-50 shadow-md'
                          : 'text-sage-700 hover:bg-sage-50 hover:text-sage-900'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}

                {/* Logout Button */}
                <button
                  onClick={logoutBtnClick}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-700 hover:bg-rose-50 transition-all duration-300 mt-4"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Mobile Header - Shows on small screens */}
          <div className="lg:hidden fixed top-0 left-0 right-0 w-full bg-white border-b border-sage-200 p-4 z-40 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center text-sage-700 text-sm font-playfair font-bold">
                  {getInitials()}
                </div>
                <div>
                  <h2 className="text-sm font-playfair font-bold text-sage-900">{userData?.username || 'User'}</h2>
                  <p className="text-xs text-sage-600 truncate max-w-[150px]">{getActiveTab()}</p>
                </div>
              </div>
              <button
                onClick={logoutBtnClick}
                className="p-2 text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                aria-label="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <main className="flex-1 min-h-screen w-full lg:w-auto">
            <div className="p-4 lg:p-8 pt-20 lg:pt-8">
              <div className="max-w-6xl mx-auto">
                {/* Mobile Navigation - Grid */}
                <div className="lg:hidden mb-6 grid grid-cols-2 gap-3">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname.includes(item.id);
                    
                    return (
                      <Link
                        key={item.id}
                        to={item.path}
                        className={`flex flex-col items-center justify-center gap-2 px-3 py-4 rounded-xl transition-all shadow-sm ${
                          isActive
                            ? 'bg-sage-600 text-cream-50 shadow-md'
                            : 'bg-white text-sage-700 border border-sage-200 hover:border-sage-400 active:scale-95'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-xs font-medium text-center leading-tight">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>

                {/* Page Header */}
                <div className="mb-6 hidden lg:block">
                  <h1 className="text-3xl font-playfair font-bold text-sage-900 mb-2">
                    {getActiveTab()}
                  </h1>
                  <p className="text-sage-600">Welcome back, {userData?.username || 'User'}! Manage your account and orders.</p>
                </div>

                {/* Content Outlet */}
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>

      <FooterSection />
    </>
  );
};
