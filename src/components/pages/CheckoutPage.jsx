import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { cartService } from "@/services/api/cartService";
import { orderService } from "@/services/api/orderService";
import { toast } from "react-toastify";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

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
      
      if (items.length === 0) {
        navigate("/");
        toast.info("Your cart is empty. Add some items first!");
        return;
      }
      
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

  const handlePlaceOrder = async () => {
    try {
      setIsProcessing(true);
      
      const orderNumber = await orderService.generateOrderNumber();
      
      const orderData = {
        id: orderNumber,
        items: cartItems,
        totalAmount: total,
        orderDate: new Date().toISOString(),
        status: "confirmed"
      };

      const order = await orderService.create(orderData);
      await cartService.clear();
      
      navigate(`/order-confirmation/${order.Id}`, { 
        state: { order, orderNumber } 
      });
      
      toast.success("Order placed successfully!");
    } catch (err) {
      toast.error("Failed to place order");
      setIsProcessing(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(price);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <ErrorView 
        message={error} 
        onRetry={loadCart}
      />
    );
  }

  if (cartItems.length === 0) {
    return (
      <Empty
        icon="ShoppingCart"
        title="Your cart is empty"
        message="Add some items to your cart before checking out."
        action={() => navigate("/")}
        actionLabel="Continue Shopping"
      />
    );
  }

  const tax = total * 0.08; // 8% tax
  const finalTotal = total + tax;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => navigate("/cart")}
              className="inline-flex items-center gap-2"
            >
              <ApperIcon name="ArrowLeft" size={16} />
              Back to Cart
            </Button>
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold font-display text-primary">
              Review Your Order
            </h1>
            <p className="text-gray-600">
              Please review your items before completing your purchase
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Items */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-semibold font-display text-primary">
                Order Items ({cartItems.length})
              </h2>
              
              <div className="bg-white rounded-xl shadow-soft p-6 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.productId} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1 space-y-1">
                      <h4 className="font-medium text-primary">{item.name}</h4>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatPrice(item.price)} each
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-primary font-display">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold font-display text-primary">
                Order Summary
              </h2>
              
              <div className="bg-white rounded-xl shadow-soft p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  
                  <hr className="border-gray-200" />
                  
                  <div className="flex justify-between text-xl font-bold font-display text-primary">
                    <span>Total</span>
                    <span>{formatPrice(finalTotal)}</span>
                  </div>
                </div>

                <Button
                  size="lg"
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-accent to-red-500 hover:brightness-110 shadow-elevated"
                >
                  {isProcessing ? (
                    <>
                      <ApperIcon name="Loader2" className="w-5 h-5 mr-2 animate-spin" />
                      Processing Order...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="CreditCard" className="w-5 h-5 mr-2" />
                      Place Order
                    </>
                  )}
                </Button>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <ApperIcon name="Shield" className="w-5 h-5 text-green-600 mt-0.5" />
                  <div className="text-sm space-y-1">
                    <p className="font-medium text-green-800">Secure Checkout</p>
                    <p className="text-green-700">
                      Your payment information is encrypted and secure.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;