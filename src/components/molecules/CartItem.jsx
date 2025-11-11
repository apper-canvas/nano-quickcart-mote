import React from "react";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const CartItem = ({ item, onUpdateQuantity, onRemove, className }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(price);
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) {
      handleRemove();
      return;
    }
    onUpdateQuantity(item.productId, newQuantity);
  };

  const handleRemove = () => {
    onRemove(item.productId);
    toast.success("Item removed from cart");
  };

  return (
    <div className={cn("flex items-center gap-4 p-4 bg-white rounded-xl shadow-soft", className)}>
      <img
        src={item.image}
        alt={item.name}
        className="w-16 h-16 object-cover rounded-lg"
      />
      
      <div className="flex-1 space-y-1">
        <h4 className="font-medium text-primary line-clamp-1">{item.name}</h4>
        <p className="text-sm text-gray-600">
          {formatPrice(item.price)} each
        </p>
        <p className="text-lg font-bold text-primary font-display">
          {formatPrice(item.price * item.quantity)}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={item.quantity <= 1}
          className="w-8 h-8 p-0"
        >
          <ApperIcon name="Minus" size={14} />
        </Button>
        
        <span className="w-8 text-center font-medium">{item.quantity}</span>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleQuantityChange(item.quantity + 1)}
          className="w-8 h-8 p-0"
        >
          <ApperIcon name="Plus" size={14} />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleRemove}
          className="w-8 h-8 p-0 text-red-500 hover:text-red-700 ml-2"
        >
          <ApperIcon name="Trash2" size={14} />
        </Button>
      </div>
    </div>
  );
};

export default CartItem;