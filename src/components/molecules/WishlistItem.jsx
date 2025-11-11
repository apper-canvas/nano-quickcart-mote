import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { wishlistService } from "@/services/api/wishlistService";
import { cartService } from "@/services/api/cartService";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import ConfirmationModal from "@/components/atoms/ConfirmationModal";
import Badge from "@/components/atoms/Badge";

const WishlistItem = ({ item, onWishlistUpdate }) => {
  const [loading, setLoading] = useState({
    addToCart: false,
    buyNow: false,
    remove: false
  });
  const [confirmDelete, setConfirmDelete] = useState({ show: false });
  const navigate = useNavigate();

  const product = item.product;

  const setLoadingState = (action, state) => {
    setLoading(prev => ({ ...prev, [action]: state }));
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!product) return;
    
    setLoadingState('addToCart', true);
    try {
      await cartService.addItem(product.Id, 1);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error("Failed to add to cart");
      console.error("Error adding to cart:", error);
    } finally {
      setLoadingState('addToCart', false);
    }
  };

  const handleBuyNow = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!product) return;
    
    setLoadingState('buyNow', true);
    try {
      await cartService.addItem(product.Id, 1);
      navigate('/checkout');
    } catch (error) {
      toast.error("Failed to process buy now");
      console.error("Error processing buy now:", error);
    } finally {
      setLoadingState('buyNow', false);
    }
  };

const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setConfirmDelete({ show: true });
  };

const handleConfirmDelete = async () => {
    setLoadingState('remove', true);
    try {
      const result = await wishlistService.remove(item.productId);
      if (result.success) {
        onWishlistUpdate();
        toast.success("Removed from wishlist");
      }
    } catch (error) {
      toast.error("Failed to remove from wishlist");
      console.error("Error removing from wishlist:", error);
    } finally {
      setLoadingState('remove', false);
      setConfirmDelete({ show: false });
    }
  };

  const handleCancelDelete = () => {
    setConfirmDelete({ show: false });
  };

  const handleProductClick = () => {
    if (product?.Id) {
      navigate(`/product/${product.Id}`);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(price);
  };

  const isOutOfStock = product?.stock === 0;

  if (!product) {
    return (
      <div className="bg-white rounded-xl shadow-soft p-6 text-center">
        <div className="text-gray-500 mb-4">
          <ApperIcon name="AlertCircle" size={48} className="mx-auto mb-2" />
          <p>Product information unavailable</p>
        </div>
<Button
          variant="ghost"
          onClick={handleDeleteClick}
          disabled={loading.remove}
          className="text-red-600 hover:text-red-800"
        >
          {loading.remove ? (
            <ApperIcon name="Loader2" size={16} className="animate-spin mr-2" />
          ) : (
            <ApperIcon name="Trash2" size={16} className="mr-2" />
          )}
          Remove
        </Button>
      </div>
    );
  }

  return (
    <div 
      className="bg-white rounded-xl shadow-soft hover:shadow-elevated transition-all duration-300 overflow-hidden group cursor-pointer"
      onClick={handleProductClick}
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
<button
          onClick={handleDeleteClick}
          disabled={loading.remove}
          className={cn(
            "absolute top-2 right-2 z-10 p-2 rounded-full",
            "bg-white/90 backdrop-blur-sm shadow-soft",
            "hover:bg-white hover:shadow-elevated",
            "transition-all duration-200 ease-out",
            "hover:scale-110 active:scale-95",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
          aria-label="Remove from wishlist"
        >
          {loading.remove ? (
            <ApperIcon name="Loader2" size={16} className="animate-spin text-red-600" />
          ) : (
            <ApperIcon name="Trash2" size={16} className="text-red-600" />
          )}
        </button>

        <img
          src={product.images?.[0] || '/placeholder-product.jpg'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="error" size="lg">Out of Stock</Badge>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="mb-3">
          <h3 className="font-semibold text-primary text-lg mb-1 group-hover:text-accent transition-colors line-clamp-2">
            {product.name}
          </h3>
          
          {product.brand && (
            <p className="text-sm text-gray-600 mb-2">by {product.brand}</p>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-accent">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            
            {product.rating && (
              <div className="flex items-center gap-1">
                <ApperIcon name="Star" size={14} className="text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600">{product.rating}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {!isOutOfStock && (
            <Button
              onClick={handleBuyNow}
              disabled={loading.buyNow}
              className="w-full bg-gradient-to-r from-accent to-red-500 hover:brightness-110"
            >
              {loading.buyNow ? (
                <ApperIcon name="Loader2" size={16} className="animate-spin mr-2" />
              ) : (
                <ApperIcon name="Zap" size={16} className="mr-2" />
              )}
              Buy Now
            </Button>
          )}
          
          <Button
            variant={isOutOfStock ? "disabled" : "outline"}
            onClick={handleAddToCart}
            disabled={loading.addToCart || isOutOfStock}
            className="w-full"
          >
            {loading.addToCart ? (
              <ApperIcon name="Loader2" size={16} className="animate-spin mr-2" />
            ) : (
              <ApperIcon name="ShoppingCart" size={16} className="mr-2" />
            )}
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </Button>
        </div>

        {/* Added Date */}
        {item.addedAt && (
          <p className="text-xs text-gray-500 mt-3 text-center">
            Added {new Date(item.addedAt).toLocaleDateString()}
          </p>
        )}
</div>
      
      <ConfirmationModal
        isOpen={confirmDelete.show}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Remove from Wishlist"
        message={`Are you sure you want to remove "${product?.name || 'this item'}" from your wishlist?`}
        confirmText="Remove"
        cancelText="Keep"
        loading={loading.remove}
      />
    </div>
  );
};

export default WishlistItem;