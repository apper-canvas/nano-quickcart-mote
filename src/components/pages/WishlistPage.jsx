import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import WishlistItem from "@/components/molecules/WishlistItem";
import { wishlistService } from "@/services/api/wishlistService";

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadWishlistItems();
  }, []);

  const loadWishlistItems = async () => {
    try {
      setError("");
      const items = await wishlistService.getWishlistWithProducts();
      setWishlistItems(items);
    } catch (err) {
      setError(err.message || "Failed to load wishlist");
      console.error("Error loading wishlist items:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleWishlistUpdate = () => {
    loadWishlistItems();
  };

  const handleClearWishlist = async () => {
    if (!window.confirm("Are you sure you want to clear your entire wishlist?")) {
      return;
    }

    try {
      await wishlistService.clear();
      setWishlistItems([]);
    } catch (error) {
      console.error("Error clearing wishlist:", error);
    }
  };

  if (loading) {
    return <Loading variant="page" className="min-h-screen" />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <ErrorView 
            message={error} 
            onRetry={loadWishlistItems}
            className="max-w-md mx-auto"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <ApperIcon name="Heart" className="w-7 h-7 text-accent" />
            <div>
              <h1 className="text-3xl font-bold font-display text-primary">
                My Wishlist
              </h1>
              <p className="text-gray-600 mt-1">
                {wishlistItems.length} item{wishlistItems.length !== 1 ? "s" : ""} saved
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="hidden sm:flex items-center gap-2"
            >
              <ApperIcon name="ArrowLeft" size={16} />
              Continue Shopping
            </Button>
            
            {wishlistItems.length > 0 && (
              <Button
                variant="ghost"
                onClick={handleClearWishlist}
                className="text-red-600 hover:text-red-800 hover:bg-red-50"
              >
                <ApperIcon name="Trash2" size={16} className="mr-2" />
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        {wishlistItems.length === 0 ? (
          <div className="max-w-md mx-auto">
            <Empty
              icon="Heart"
              title="Your wishlist is empty"
              message="Discover amazing products and save your favorites here!"
              action={() => navigate("/")}
              actionLabel="Start Shopping"
              className="bg-white rounded-xl shadow-soft p-8"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <WishlistItem
                key={item.Id}
                item={item}
                onWishlistUpdate={handleWishlistUpdate}
              />
            ))}
          </div>
        )}

        {/* Mobile Continue Shopping Button */}
        <div className="sm:hidden mt-8 text-center">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="w-full max-w-xs"
          >
            <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;