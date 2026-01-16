import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { FullpageSpinnerLoader } from "../components/loaders/spinnerIcon"; // Ensure you have a loader

// Lazy Load Pages
const Homepage = lazy(() => import("../pages/homepage/homepage"));
const ShopPage = lazy(() => import("../pages/shopPage"));
const AdminPage = lazy(() => import("../pages/adminPage"));
const SearchPage = lazy(() => import("../pages/searchPage/searchPage").then(module => ({ default: module.SearchPage })));
const ProductDetailsPage = lazy(() => import("../pages/productDetailsPage").then(module => ({ default: module.ProductDetailsPage })));
const CheckoutPage = lazy(() => import("../pages/checkoutPage").then(module => ({ default: module.CheckoutPage })));
const LoginPage = lazy(() => import("../pages/loginPage").then(module => ({ default: module.LoginPage })));
const RegisterPage = lazy(() => import("../pages/RegisterPage").then(module => ({ default: module.RegisterPage })));
const EnterNewPassword = lazy(() => import("../pages/enterNewPasswordPage").then(module => ({ default: module.EnterNewPassword })));
const ProfilePage = lazy(() => import("../pages/profilePage/index").then(module => ({ default: module.ProfilePage })));
const AccountInformation = lazy(() => import("../pages/profilePage/accountInformation").then(module => ({ default: module.AccountInformation })));
const Adresses = lazy(() => import("../pages/profilePage/Adresses").then(module => ({ default: module.Adresses })));
const AccountSettings = lazy(() => import("../pages/profilePage/AccountSettings").then(module => ({ default: module.AccountSettings })));
const Orders = lazy(() => import("../pages/profilePage/Orders").then(module => ({ default: module.Orders })));

const ContactUsPage = lazy(() => import("../pages/contactUsPage").then(module => ({ default: module.ContactUsPage })));
const AboutUsPage = lazy(() => import("../pages/aboutUsPage").then(module => ({ default: module.AboutUsPage })));
const GalleryPage = lazy(() => import("../pages/galleryPage"));

// Admin Sub-pages
const AdminDashboard = lazy(() => import("../pages/adminPage/newDashboard").then(module => ({ default: module.AdminDashboard })));
const ProductManagement = lazy(() => import("../pages/adminPage/productTab/").then(module => ({ default: module.ProductManagement })));
const AddNewProduct = lazy(() => import("../pages/adminPage/productTab/addNewProduct").then(module => ({ default: module.AddNewProduct })));
const EditAndupdateProductModal = lazy(() => import("../pages/adminPage/productTab/editAndUpdateProductModal").then(module => ({ default: module.EditAndupdateProductModal })));
const UserManagement = lazy(() => import("../pages/adminPage/user").then(module => ({ default: module.UserManagement })));
const AdminManagement = lazy(() => import("../pages/adminPage/adminManagement/admins").then(module => ({ default: module.AdminManagement })));
const OrdersManagement = lazy(() => import("../pages/adminPage/OrdersManagement"));
const OrderDetails = lazy(() => import("../pages/adminPage/OrderDetails"));
const SettingsPage = lazy(() => import("../pages/adminPage/settings").then(module => ({ default: module.SettingsPage })));
const InstagramGalleryManager = lazy(() => import("../pages/adminPage/InstagramGalleryManager"));
const NotificationsProtocol = lazy(() => import("../pages/adminPage/Notifications"));

// Policies
const PrivacyPolicy = lazy(() => import("../pages/policies/PrivacyPolicy").then(module => ({ default: module.PrivacyPolicy })));
const TermsConditions = lazy(() => import("../pages/policies/TermsConditions").then(module => ({ default: module.TermsConditions })));
const ReturnRefundPolicy = lazy(() => import("../pages/policies/ReturnRefundPolicy").then(module => ({ default: module.ReturnRefundPolicy })));
const ShippingPolicy = lazy(() => import("../pages/policies/ShippingPolicy").then(module => ({ default: module.ShippingPolicy })));
const CancellationPolicy = lazy(() => import("../pages/policies/CancellationPolicy").then(module => ({ default: module.CancellationPolicy })));
const DataDeletion = lazy(() => import("../pages/DataDeletion").then(module => ({ default: module.DataDeletion })));

// Auth Flow
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));
const VerifyOtp = lazy(() => import("../pages/auth/VerifyOtp"));
const ResetPassword = lazy(() => import("../pages/auth/ResetPassword"));

const PagesRoute = ({ setIsCartSectionActive }) => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<FullpageSpinnerLoader />}>
        <Routes key={location.pathname} location={location}>
          <Route path="/" element={<Homepage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/aboutUs" element={<AboutUsPage />} />
          <Route path="/contactUs" element={<ContactUsPage />} />
          
          {/* Policy Pages */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsConditions />} />
          <Route path="/return-refund-policy" element={<ReturnRefundPolicy />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/cancellation-policy" element={<CancellationPolicy />} />
          <Route path="/data-deletion" element={<DataDeletion />} />

          {/* Admin Routes - consolidated under /admin */}
          <Route path="search" element={<SearchPage />} />
          <Route path="product/:productId" element={<ProductDetailsPage />} />
          <Route path="checkout" element={<CheckoutPage {...{ setIsCartSectionActive }} />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="verify-otp" element={<VerifyOtp />} />
          <Route path="reset-password" element={<ResetPassword />} />

          <Route path="changeMyPassword" element={<EnterNewPassword />} />

          <Route path="profilePage" element={<ProfilePage />}>
            <Route index element={<Navigate to="accountInformation" />} />
            <Route path="accountInformation" element={<AccountInformation />} />
            <Route path="address" element={<Adresses />} />
            <Route path="myOrders" element={<Orders />} />
            <Route path="accountSettings" element={<AccountSettings />} />
          </Route>

          <Route path="admin" element={<AdminPage />}>
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="product-Management" element={<ProductManagement />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="products/add" element={<AddNewProduct />} />
            <Route path="products/edit/:id" element={<EditAndupdateProductModal />} />

            <Route path="orders-Management" element={<OrdersManagement />} />
            <Route path="orders-management/:id" element={<OrderDetails />} />
            <Route path="user-Management" element={<UserManagement />} />
            <Route path="admin-Management" element={<AdminManagement />} />
            <Route path="instagram-gallery" element={<InstagramGalleryManager />} />
            <Route path="notifications" element={<NotificationsProtocol />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          <Route path="*" element={<h2>path doesnt exist</h2>} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

export default PagesRoute;
