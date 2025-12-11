import React from "react";
import { useEffect, useState } from "react";
import { Menu, X, Heart, User, ShoppingBag, Search } from "lucide-react";
import { NavTabs } from "./navTabs";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
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
      toast("Hold on, while product is loading", {
        type: "warning",
        autoClose: 3000,
      });
    }
    if (isLoading && loadingOrErrorMessage !== "Loading") {
      toast("Products couldn't be loaded", {
        type: "error",
        autoClose: 3000,
      });
    } else if (allProductsData.length > 0) {
      navigateToSearchPage(
        {
          pathname: "/search",
          search: `?searchedProduct=${e.currentTarget.previousElementSibling.value}`,
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
  };

  return (
    <header className="sticky top-0 z-[1000] bg-primary shadow-lg">
      <nav className="container-page">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <img
            src={logoDark}
            alt="IZHAYAM HANDLOOM FURNITURE"
            className="h-10 md:h-16 w-auto cursor-pointer brightness-[5] contrast-[0.8]"
            onClick={() => navigate("/")}
          />

          {/* Desktop Navigation */}
          {isLargeScreen && (
            <div className="hidden md:flex items-center">
              <NavTabs />
            </div>
          )}

          {/* Right Icons */}
          <div className="flex items-center gap-2 md:gap-6">
            <button
              className="p-2 rounded-lg hover:bg-primary-foreground/10 transition-colors hidden md:flex"
              onClick={() => setIsSearchClicked(!isSearchClicked)}
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-primary-foreground" />
            </button>

            <button
              onClick={() => setIsWishlistActive(true)}
              className="p-2 rounded-lg hover:bg-primary-foreground/10 transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 text-primary-foreground" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-foreground text-xs rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </button>

            {isLargeScreen && (
              <button
                onClick={handleMyAccountClick}
                className="p-2 rounded-lg hover:bg-primary-foreground/10 transition-colors hidden md:flex"
                aria-label="Account"
              >
                <User className="w-5 h-5 text-primary-foreground" />
              </button>
            )}

            <button
              onClick={() => setIsCartSectionActive(true)}
              className="p-2 rounded-lg hover:bg-primary-foreground/10 transition-colors relative"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-primary-foreground" />
              {totalProductQuantityCart > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-foreground text-xs rounded-full flex items-center justify-center font-bold">
                  {totalProductQuantityCart}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setDisplayVerticalNavBar(!displayVerticalNavBar)}
              className="p-2 rounded-lg hover:bg-primary-foreground/10 transition-colors md:hidden"
              aria-label="Toggle menu"
            >
              {displayVerticalNavBar ? (
                <X className="w-5 h-5 text-primary-foreground" />
              ) : (
                <Menu className="w-5 h-5 text-primary-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {displayVerticalNavBar && !isLargeScreen && (
          <div className="md:hidden py-4 border-t border-primary-foreground/20 bg-primary animate-fade-in">
            <NavTabs isMobile={true} setDisplayVerticalNavBar={setDisplayVerticalNavBar} />
            
            {/* Mobile Account Link */}
            <button
              onClick={() => {
                handleMyAccountClick();
                setDisplayVerticalNavBar(false);
              }}
              className="w-full px-4 py-3 rounded-lg text-sm font-semibold text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground flex items-center gap-2 mt-2"
            >
              <User className="w-4 h-4" />
              Account
            </button>
          </div>
        )}

        {/* Search Dropdown */}
        {isSearchClicked && (
          <div className="absolute left-0 right-0 top-full bg-primary shadow-lg animate-fade-in">
            <div className="container-page py-4">
              <div className="flex gap-2 max-w-2xl mx-auto">
                <input
                  type="text"
                  placeholder="Search for furniture..."
                  className="flex-1 px-4 py-3 rounded-lg bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground/30"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearching(e);
                      setIsSearchClicked(false);
                    }
                  }}
                />
                <button
                  onClick={handleSearching}
                  className="btn-secondary px-6"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
