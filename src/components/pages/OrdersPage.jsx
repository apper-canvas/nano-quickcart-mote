import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/utils/cn";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { orderService } from "@/services/api/orderService";
import { format } from "date-fns";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setError("");
      const ordersData = await orderService.getAll();
      const sortedOrders = ordersData.sort((a, b) => 
        new Date(b.orderDate) - new Date(a.orderDate)
      );
      setOrders(sortedOrders);
    } catch (err) {
      setError(err.message || "Failed to load orders");
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
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  const getStatusVariant = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "success";
      case "processing":
        return "warning";
      case "shipped":
        return "primary";
      case "delivered":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <ErrorView 
        message={error} 
        onRetry={loadOrders}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <ApperIcon name="Package" className="w-8 h-8 text-accent" />
            <h1 className="text-3xl font-bold font-display text-primary">
              Order History
            </h1>
          </div>

          {orders.length === 0 ? (
            <Empty
              icon="Package"
              title="No orders yet"
              message="You haven't placed any orders yet. Start shopping to see your order history here."
              action={() => window.location.href = "/"}
              actionLabel="Start Shopping"
            />
          ) : (
            <div className="space-y-6">
              <p className="text-gray-600">
                You have {orders.length} order{orders.length !== 1 ? "s" : ""}
              </p>

              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.Id} className="p-6 hover:shadow-elevated transition-shadow duration-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold font-display text-primary">
                            Order #{order.id}
                          </h3>
                          <Badge variant={getStatusVariant(order.status)} size="sm">
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          Placed on {formatDate(order.orderDate)}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary font-display">
                            {formatPrice(order.totalAmount + (order.totalAmount * 0.08))}
                          </p>
                          <p className="text-sm text-gray-600">
                            {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                        
                        <Link
                          to={`/order-confirmation/${order.Id}`}
                          className="inline-flex items-center gap-2 text-accent hover:text-red-500 font-medium transition-colors duration-200"
                        >
                          View Details
                          <ApperIcon name="ArrowRight" size={16} />
                        </Link>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {order.items.slice(0, 3).map((item) => (
                        <div key={item.productId} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-primary text-sm truncate">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-600">
                              Qty: {item.quantity} × {formatPrice(item.price)}
                            </p>
                          </div>
                        </div>
                      ))}
                      
                      {order.items.length > 3 && (
                        <div className="flex items-center justify-center p-3 bg-gray-100 rounded-lg">
                          <span className="text-sm text-gray-600">
                            +{order.items.length - 3} more item{order.items.length - 3 !== 1 ? "s" : ""}
                          </span>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;