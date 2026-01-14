import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Homepage from "../pages/homepage/homepage";
import ShopPage from "../pages/shopPage";
import AdminPage from "../pages/adminPage";
import { SearchPage } from "../pages/searchPage/searchPage";
import { ProductDetailsPage } from "../pages/productDetailsPage.js";
import { CheckoutPage } from "../pages/checkoutPage";
import { LoginPage } from "../pages/loginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { EnterNewPassword } from "../pages/enterNewPasswordPage";
import { ProfilePage } from "../pages/profilePage/index";
import { AccountInformation } from "../pages/profilePage/accountInformation";
import { Adresses } from "../pages/profilePage/Adresses";
import { AccountSettings } from "../pages/profilePage/AccountSettings";
import { Orders } from "../pages/profilePage/Orders";
import { Navigate } from "react-router-dom";
import { ContactUsPage } from "../pages/contactUsPage";
import { AboutUsPage } from "../pages/aboutUsPage";
import GalleryPage from "../pages/galleryPage";
import { AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { AdminDashboard } from "../pages/adminPage/newDashboard";
import { ProductManagement } from "../pages/adminPage/productTab/";
import { AddNewProduct } from "../pages/adminPage/productTab/addNewProduct";
import { EditAndupdateProductModal } from "../pages/adminPage/productTab/editAndUpdateProductModal";
import { UserManagement } from "../pages/adminPage/user";
import { AdminManagement } from "../pages/adminPage/adminManagement/admins";
import OrdersManagement from "../pages/adminPage/OrdersManagement";
import OrderDetails from "../pages/adminPage/OrderDetails";
import { SettingsPage } from "../pages/adminPage/settings";
import InstagramGalleryManager from "../pages/adminPage/InstagramGalleryManager";
import NotificationsProtocol from "../pages/adminPage/Notifications";


const PagesRoute = ({ setIsCartSectionActive }) => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes key={location.pathname} location={location}>
        <Route path="/" element={<Homepage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/aboutUs" element={<AboutUsPage />} />
        <Route path="/contactUs" element={<ContactUsPage />} />

        {/* Admin Routes - consolidated under /admin */}
        <Route path="search" element={<SearchPage />} />
        <Route path="product/:productId" element={<ProductDetailsPage />} />
        <Route path="checkout" element={<CheckoutPage {...{ setIsCartSectionActive }} />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
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
    </AnimatePresence>
  );
};

export default PagesRoute;
