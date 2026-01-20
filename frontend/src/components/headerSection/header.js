import React from "react";
import { useEffect, useState } from "react";
import { Menu, X, Heart, User, ShoppingBag, Search } from "lucide-react";
import { NavTabs } from "./navTabs";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import logoDark from "../../logoDark.png";

export const Header = ({ setIsWishlistActive, setIsCartSectionActive, isLargeScreen }) => {
  const [displayVerticalNavBar, setDisplayVerticalNavBar] = useState(false);
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [totalProductQuantityCart, setTotalProductQuantityCart] = useState(0);

  const { allProductsData, isLoading, loadingOrErrorMessage } = useSelector((state) => state.productsData);
  const { wishlist, cart } = useSelector((state) => state.wishlistAndCartSection);

  const navigate = useNavigate();
  const navigateToSearchPage = useNavigate();
  let location = useLocation();

  // SEARCH ENTER BUTTON WONT WORK WHEN THE allProducts IS LOADING OR THERE IS AN ERROR
  const handleSearching = (e) => {
    if (isLoading && loadingOrErrorMessage === "Loading") {
      // Toast removed
    }
    if (isLoading && loadingOrErrorMessage !== "Loading") {
      // Toast removed
    } else if (allProductsData.length > 0) {
      const searchValue =
        e.currentTarget.tagName === "INPUT"
          ? e.currentTarget.value
          : e.currentTarget.previousElementSibling.value;

      navigateToSearchPage(
        {
          pathname: "/search",
          search: `?searchedProduct=${searchValue}`,
        },
        {
          state: location.pathname,
        }
      );
    }
  };

  // on entering a new pathname these should be false
  useEffect(() => {
    setIsSearchClicked(false);
    setDisplayVerticalNavBar(false);
  }, [location.pathname]);

  // large screens are big ipads, desktop and laptop screen starting from 768
  useEffect(() => {
    isLargeScreen && setDisplayVerticalNavBar(false);
  }, [isLargeScreen]);

  useEffect(() => {
    let total = 0;
    for (let key of cart) {
      total += key.quantity;
    }
    setTotalProductQuantityCart(total);
  }, [cart]);

  // on user or myaccount icon btn click
  const handleMyAccountClick = async () => {
    navigate("/profilePage/accountInformation");
    window.scrollTo(0, 0);
  };

  const searchRef = React.useRef(null);

  // Close search on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchClicked(false);
      }
    };

    if (isSearchClicked) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchClicked]);

  return (
    <header className="sticky top-0 z-[1000] bg-primary shadow-lg">
      <nav className="container-page">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <img
            src={logoDark}
            alt="IZHAYAM HANDLOOM FURNITURE"
            className="h-10 md:h-16 w-auto cursor-pointer transition-transform duration-300 hover:scale-105"
            onClick={() => {
              navigate("/");
              window.scrollTo(0, 0);
            }}
          />

          {/* Desktop Navigation */}
          {isLargeScreen && (
            <div className="hidden md:flex items-center">
              <NavTabs />
            </div>
          )}

          {/* Right Icons */}
          <div className="flex items-center gap-2 md:gap-6">
            <div ref={searchRef}>
              <button
                className="p-2 rounded-lg hover:bg-primary-foreground/10 transition-all duration-300 hover:scale-110 active:scale-95"
                onClick={() => setIsSearchClicked(!isSearchClicked)}
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-primary-foreground transition-transform duration-300" />
              </button>

              {/* Search Dropdown - Moved inside ref container to detect clicks properly */}
              {isSearchClicked && (
                <div className="absolute left-0 right-0 top-full bg-primary shadow-lg animate-fade-in border-t border-primary-foreground/10">
                  <div className="container-page py-4">
                    <div className="flex gap-2 max-w-2xl mx-auto w-full px-4 md:px-0">
                      <input
                        type="text"
                        placeholder="Search..."
                        className="flex-1 min-w-0 px-4 py-3 rounded-lg bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground/30 text-sm md:text-base"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSearching(e);
                            setIsSearchClicked(false);
                          }
                        }}
                      />
                      <button
                        onClick={handleSearching}
                        className="btn-secondary px-4 md:px-6 whitespace-nowrap text-sm md:text-base"
                      >
                        Search
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsWishlistActive(true)}
              className="group p-2 rounded-lg hover:bg-primary-foreground/10 transition-all duration-300 hover:scale-110 active:scale-95 relative"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 text-primary-foreground transition-transform duration-300 group-hover:fill-primary-foreground/20" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-foreground text-xs rounded-full flex items-center justify-center font-bold opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button
              onClick={handleMyAccountClick}
              className="p-2 rounded-lg hover:bg-primary-foreground/10 transition-all duration-300 hover:scale-110 active:scale-95"
              aria-label="Account"
            >
              <User className="w-5 h-5 text-primary-foreground transition-transform duration-300" />
            </button>

            <button
              onClick={() => setIsCartSectionActive(true)}
              className="group p-2 rounded-lg hover:bg-primary-foreground/10 transition-all duration-300 hover:scale-110 active:scale-95 relative"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-primary-foreground transition-transform duration-300" />
              {totalProductQuantityCart > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-foreground text-xs rounded-full flex items-center justify-center font-bold opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
                  {totalProductQuantityCart}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setDisplayVerticalNavBar(!displayVerticalNavBar)}
              className="p-2 rounded-lg hover:bg-primary-foreground/10 transition-all duration-300 hover:scale-110 active:scale-95 md:hidden"
              aria-label="Toggle menu"
            >
              {displayVerticalNavBar ? (
                <X className="w-5 h-5 text-primary-foreground transition-transform duration-300 rotate-0 hover:rotate-90" />
              ) : (
                <Menu className="w-5 h-5 text-primary-foreground transition-transform duration-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {displayVerticalNavBar && !isLargeScreen && (
          <div className="md:hidden py-4 border-t border-primary-foreground/20 bg-primary animate-fade-in">
            <NavTabs isMobile={true} setDisplayVerticalNavBar={setDisplayVerticalNavBar} />
          </div>
        )}


      </nav>
    </header>
  );
};
