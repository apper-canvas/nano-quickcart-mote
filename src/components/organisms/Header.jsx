import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";
import SearchBar from "@/components/molecules/SearchBar";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { cartService } from "@/services/api/cartService";

const Header = ({ className }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadCartCount();
    
    const handleStorageChange = () => {
      loadCartCount();
    };

    window.addEventListener("storage", handleStorageChange);
    
    const interval = setInterval(() => {
      loadCartCount();
    }, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const loadCartCount = async () => {
    try {
      const count = await cartService.getItemCount();
      setCartItemCount(count);
    } catch (error) {
      console.error("Error loading cart count:", error);
    }
  };

  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/?search=${encodeURIComponent(query.trim())}`);
    } else {
      navigate("/");
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  return (
    <header className={cn("sticky top-0 z-50 bg-white shadow-soft border-b border-gray-100", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-accent to-red-500 rounded-xl flex items-center justify-center shadow-soft group-hover:shadow-elevated transition-all duration-200">
              <ApperIcon name="ShoppingCart" className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold font-display text-primary group-hover:text-accent transition-colors duration-200">
              QuickCart
            </span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearchSubmit} className="w-full">
              <SearchBar
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search for products..."
                className="w-full"
              />
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-primary hover:text-accent font-medium transition-colors duration-200"
            >
              Shop
            </Link>
            
            <Link
              to="/orders"
              className="text-primary hover:text-accent font-medium transition-colors duration-200"
            >
              Orders
            </Link>

            <Link
              to="/cart"
              className="relative flex items-center gap-2 text-primary hover:text-accent font-medium transition-colors duration-200 group"
            >
              <ApperIcon name="ShoppingCart" className="w-5 h-5 group-hover:animate-bounce-soft" />
              <span>Cart</span>
              {cartItemCount > 0 && (
                <Badge 
                  variant="primary" 
                  size="sm" 
                  className="animate-pulse-soft"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex items-center gap-2 text-primary"
          >
            <Link
              to="/cart"
              className="relative flex items-center"
            >
              <ApperIcon name="ShoppingCart" className="w-6 h-6" />
              {cartItemCount > 0 && (
                <Badge 
                  variant="primary" 
                  size="sm" 
                  className="absolute -top-2 -right-2"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Link>
            <ApperIcon 
              name={isMobileMenuOpen ? "X" : "Menu"} 
              className="w-6 h-6 ml-2" 
            />
          </button>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearchSubmit}>
            <SearchBar
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search products..."
            />
          </form>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-4 space-y-4">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-primary hover:text-accent font-medium transition-colors duration-200"
            >
              Shop
            </Link>
            
            <Link
              to="/orders"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-primary hover:text-accent font-medium transition-colors duration-200"
            >
              Orders
            </Link>

            <Link
              to="/cart"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 text-primary hover:text-accent font-medium transition-colors duration-200"
            >
              <ApperIcon name="ShoppingCart" className="w-5 h-5" />
              <span>Cart</span>
              {cartItemCount > 0 && (
                <Badge variant="primary" size="sm">
                  {cartItemCount}
                </Badge>
              )}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;