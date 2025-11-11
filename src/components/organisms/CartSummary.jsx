import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import CartItem from "@/components/molecules/CartItem";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { cartService } from "@/services/api/cartService";
import { toast } from "react-toastify";

const CartSummary = ({ className }) => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadCart();
  }, []);

  useEffect(() => {
    calculateTotal();
  }, [cartItems]);

  const loadCart = async () => {
    try {
      setError("");
      const items = await cartService.getAll();
      setCartItems(items);
    } catch (err) {
      setError(err.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = async () => {
    try {
      const totalAmount = await cartService.getTotal();
      setTotal(totalAmount);
    } catch (err) {
      console.error("Error calculating total:", err);
    }
  };

  const handleUpdateQuantity = async (productId, quantity) => {
    try {
      const updatedItems = await cartService.updateQuantity(productId, quantity);
      setCartItems(updatedItems);
    } catch (err) {
      toast.error("Failed to update quantity");
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const updatedItems = await cartService.removeItem(productId);
      setCartItems(updatedItems);
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(price);
  };

  if (loading) {
    return <Loading variant="cart" className={className} />;
  }

  if (error) {
    return (
      <ErrorView 
        message={error} 
        onRetry={loadCart}
        className={className}
      />
    );
  }

  if (cartItems.length === 0) {
    return (
      <Empty
        icon="ShoppingCart"
        title="Your cart is empty"
        message="Looks like you haven't added anything to your cart yet. Start shopping to fill it up!"
        action={() => navigate("/")}
        actionLabel="Start Shopping"
        className={className}
      />
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center gap-3">
        <ApperIcon name="ShoppingCart" className="w-6 h-6 text-accent" />
        <h1 className="text-2xl font-bold font-display text-primary">
          Shopping Cart
        </h1>
        <span className="text-sm text-gray-600">
          ({cartItems.length} item{cartItems.length !== 1 ? "s" : ""})
        </span>
      </div>

      <div className="space-y-4">
        {cartItems.map((item) => (
          <CartItem
            key={item.productId}
            item={item}
            onUpdateQuantity={handleUpdateQuantity}
            onRemove={handleRemoveItem}
          />
        ))}
      </div>

      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between text-lg">
          <span className="font-medium text-primary">Subtotal</span>
          <span className="font-bold text-primary">{formatPrice(total)}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Shipping</span>
          <span>Free</span>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Tax</span>
          <span>Calculated at checkout</span>
        </div>
        
        <hr className="border-gray-300" />
        
        <div className="flex items-center justify-between text-2xl font-bold font-display">
          <span className="text-primary">Total</span>
          <span className="text-primary">{formatPrice(total)}</span>
        </div>

        <Button 
          size="lg" 
          onClick={handleCheckout}
          className="w-full bg-gradient-to-r from-accent to-red-500 hover:brightness-110 shadow-elevated"
        >
          <ApperIcon name="CreditCard" className="w-5 h-5 mr-2" />
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
};

export default CartSummary;