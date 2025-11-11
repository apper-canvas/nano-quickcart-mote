import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import ApperIcon from "@/components/ApperIcon";
import { orderService } from "@/services/api/orderService";
import { format } from "date-fns";

const OrderConfirmationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!order && id) {
      loadOrder();
    }
  }, [id, order]);

  const loadOrder = async () => {
    try {
      setError("");
      const orderData = await orderService.getById(id);
      setOrder(orderData);
    } catch (err) {
      setError(err.message || "Order not found");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(price);
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), "MMMM dd, yyyy 'at' h:mm a");
  };

  if (loading) {
    return <Loading />;
  }

  if (error || !order) {
    return (
      <ErrorView 
        message={error || "Order not found"} 
        onRetry={loadOrder}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center space-y-8">
          {/* Success Icon */}
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto shadow-elevated">
              <ApperIcon name="CheckCircle" className="w-12 h-12 text-green-600" />
            </div>
          </div>

          {/* Success Message */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold font-display text-primary">
              Order Confirmed!
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Thank you for your order. We've received your payment and your items will be shipped soon.
            </p>
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-2xl shadow-elevated p-8 text-left space-y-6">
            <div className="text-center space-y-2 border-b border-gray-200 pb-6">
              <h2 className="text-2xl font-bold font-display text-primary">
                Order #{location.state?.orderNumber || order.id}
              </h2>
              <div className="flex items-center justify-center gap-4">
                <Badge variant="success" size="lg">
                  {order.status}
                </Badge>
                <span className="text-gray-600">
                  {formatDate(order.orderDate)}
                </span>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold font-display text-primary">
                Order Items ({order.items.length})
              </h3>
              
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.productId} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1 space-y-1">
                      <h4 className="font-medium text-primary">{item.name}</h4>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity} × {formatPrice(item.price)}
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

            {/* Order Total */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(order.totalAmount)}</span>
              </div>
              
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>{formatPrice(order.totalAmount * 0.08)}</span>
              </div>
              
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              
              <hr className="border-gray-300" />
              
              <div className="flex justify-between text-2xl font-bold font-display text-primary">
                <span>Total</span>
                <span>{formatPrice(order.totalAmount + (order.totalAmount * 0.08))}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-accent to-red-500 hover:brightness-110"
            >
              <ApperIcon name="ShoppingBag" className="w-5 h-5 mr-2" />
              Continue Shopping
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/orders")}
              className="border-2 border-accent text-accent hover:bg-accent hover:text-white"
            >
              <ApperIcon name="Package" className="w-5 h-5 mr-2" />
              View All Orders
            </Button>
          </div>

          {/* Additional Info */}
          <div className="bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-200 rounded-xl p-6">
            <div className="space-y-3 text-center">
              <div className="flex items-center justify-center gap-2">
                <ApperIcon name="Truck" className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-blue-800">What's Next?</h4>
              </div>
              <p className="text-blue-700 text-sm">
                We'll send you an email confirmation shortly with your order details and tracking information once your items ship.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;