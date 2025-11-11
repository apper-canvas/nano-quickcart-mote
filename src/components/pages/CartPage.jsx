import React from "react";
import CartSummary from "@/components/organisms/CartSummary";

const CartPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CartSummary />
      </div>
    </div>
  );
};

export default CartPage;