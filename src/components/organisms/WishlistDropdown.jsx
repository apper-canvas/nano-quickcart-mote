import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import ConfirmationModal from "@/components/atoms/ConfirmationModal";
import { wishlistService } from "@/services/api/wishlistService";
import { cartService } from "@/services/api/cartService";
import { toast } from "react-toastify";

const WishlistDropdown = ({ onClose, onWishlistChange }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState({});
  const [confirmDelete, setConfirmDelete] = useState({ show: false, productId: null, productName: '' });
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
      setError("Failed to load wishlist items");
      console.error("Error loading wishlist items:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    const loadingKey = `cart-${product.Id}`;
    setActionLoading(prev => ({ ...prev, [loadingKey]: true }));
    
    try {
      await cartService.addItem(product.Id, 1);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error("Failed to add to cart");
      console.error("Error adding to cart:", error);
    } finally {
      setActionLoading(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  const handleBuyNow = async (product) => {
    const loadingKey = `buy-${product.Id}`;
    setActionLoading(prev => ({ ...prev, [loadingKey]: true }));
    
    try {
      await cartService.addItem(product.Id, 1);
      onClose();
      navigate('/checkout');
    } catch (error) {
      toast.error("Failed to process buy now");
      console.error("Error processing buy now:", error);
    } finally {
      setActionLoading(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

const handleDeleteClick = (productId, productName) => {
    setConfirmDelete({ show: true, productId, productName });
  };

  const handleConfirmDelete = async () => {
    const { productId } = confirmDelete;
    const loadingKey = `remove-${productId}`;
    setActionLoading(prev => ({ ...prev, [loadingKey]: true }));
    
    try {
      await wishlistService.remove(productId);
      const updatedItems = wishlistItems.filter(item => item.productId !== productId);
      setWishlistItems(updatedItems);
      onWishlistChange && onWishlistChange();
      toast.success("Item removed from wishlist");
      setConfirmDelete({ show: false, productId: null, productName: '' });
    } catch (error) {
      toast.error("Failed to remove from wishlist");
      console.error("Error removing from wishlist:", error);
    } finally {
      setActionLoading(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  const handleCancelDelete = () => {
    setConfirmDelete({ show: false, productId: null, productName: '' });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(price);
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-96 max-w-[90vw] bg-white rounded-xl shadow-elevated border border-gray-200 z-50 max-h-96 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ApperIcon name="Heart" className="w-5 h-5 text-accent" />
            <h3 className="font-semibold text-primary">Wishlist</h3>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onClose();
                navigate('/wishlist');
              }}
              className="text-xs"
            >
              View All
            </Button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ApperIcon name="X" size={16} className="text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {loading ? (
          <div className="p-8">
            <Loading className="text-center" />
          </div>
        ) : error ? (
          <div className="p-4 text-center text-red-600 text-sm">
            {error}
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="p-8">
            <Empty
              icon="Heart"
              title="Your wishlist is empty"
              message="Save items you love to your wishlist!"
              className="text-center"
            />
          </div>
        ) : (
          <div className="p-2">
            {wishlistItems.map((item) => (
              <div
                key={item.Id}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <img
                  src={item.product?.images?.[0] || '/placeholder-product.jpg'}
                  alt={item.product?.name || 'Product'}
                  className="w-12 h-12 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-primary truncate">
                    {item.product?.name || 'Unknown Product'}
                  </h4>
                  <p className="text-sm text-accent font-semibold">
                    {item.product?.price ? formatPrice(item.product.price) : 'Price unavailable'}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <Button
                    size="xs"
                    onClick={() => handleBuyNow(item.product)}
                    disabled={actionLoading[`buy-${item.product?.Id}`] || !item.product}
                    className="text-xs px-2 py-1"
                  >
                    {actionLoading[`buy-${item.product?.Id}`] ? (
                      <ApperIcon name="Loader2" size={12} className="animate-spin" />
                    ) : (
                      "Buy Now"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => handleAddToCart(item.product)}
                    disabled={actionLoading[`cart-${item.product?.Id}`] || !item.product}
                    className="text-xs px-2 py-1"
                  >
                    {actionLoading[`cart-${item.product?.Id}`] ? (
                      <ApperIcon name="Loader2" size={12} className="animate-spin" />
                    ) : (
                      "Add to Cart"
                    )}
                  </Button>
<button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeleteClick(item.productId, item.product?.name || 'this item');
                    }}
                    disabled={actionLoading[`remove-${item.productId}`]}
                    className="text-xs text-red-600 hover:text-red-800 transition-colors p-1"
                  >
                    {actionLoading[`remove-${item.productId}`] ? (
                      <ApperIcon name="Loader2" size={12} className="animate-spin" />
                    ) : (
                      <ApperIcon name="Trash2" size={12} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
</div>
      
      <ConfirmationModal
        isOpen={confirmDelete.show}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Remove from Wishlist"
        message={`Are you sure you want to remove "${confirmDelete.productName}" from your wishlist?`}
        confirmText="Remove"
        cancelText="Keep"
        loading={actionLoading[`remove-${confirmDelete.productId}`]}
      />
    </div>
  );
};

export default WishlistDropdown;