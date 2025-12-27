import "./index.css";
import "./App.css";
import PagesRoute from "./routes/pagesRoute";
import { Header } from "./components/headerSection/header";
import { useEffect, useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { getAllProductsData } from "./features/productSlice";
import { Wishlist } from "./components/wishlistSection";
import { Cart } from "./components/cartSection";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchIsTokenValid } from "./features/authSlice/fetchIsTokenValid";
import { getUserData } from "./features/authSlice";
import { useLocation } from "react-router-dom";
import WelcomeModal from "./components/welcomeModal/WelcomeModal";

function App() {
  const [isLargeScreen, setIsLargeScreen] = useState("");
  const [isWishlistActive, setIsWishlistActive] = useState(false);
  const [isCartSectionActive, setIsCartSectionActive] = useState(false);

  const location = useLocation();

  const isAdminRoute = useMemo(() => {
    return location.pathname.startsWith("/admin");
  }, [location.pathname]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchIsTokenValid());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      getUserData(JSON.parse(localStorage.getItem("UserData")) || "")
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllProductsData());
  }, []);

  useEffect(() => {
    const updateScreen = () => {
      setIsLargeScreen(window.innerWidth >= 768);
    };

    updateScreen();
    window.addEventListener("resize", updateScreen);
    return () => window.removeEventListener("resize", updateScreen);
  }, []);

  return (
    <div className="App-container lg:text-[18px]">

      {/* Show PUBLIC HEADER only when NOT on admin pages */}
      {!isAdminRoute && (
        <>
          <Header
            {...{
              setIsWishlistActive,
              setIsCartSectionActive,
              isLargeScreen,
            }}
          />
          <Wishlist
            {...{ isWishlistActive, setIsWishlistActive }}
          />
          <Cart
            {...{ isCartSectionActive, setIsCartSectionActive }}
          />
        </>
      )}

      {!isAdminRoute && <WelcomeModal />}

      {/* Render app content */}
      <PagesRoute {...{ setIsCartSectionActive }} />

      <ToastContainer
        position="top-right"
        transition={Slide}
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
