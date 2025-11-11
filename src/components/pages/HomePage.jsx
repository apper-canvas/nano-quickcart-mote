import React from "react";
import ProductGrid from "@/components/organisms/ProductGrid";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const HomePage = () => {
return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary via-secondary to-primary overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-red-500/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-display text-white leading-tight">
                Discover Amazing{" "}
                <span className="bg-gradient-to-r from-accent to-red-500 bg-clip-text text-transparent">
                  Products
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
                Shop the latest electronics, fashion, and home essentials with fast shipping, 
                unbeatable prices, and exceptional customer service.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button 
                className="bg-gradient-to-r from-accent to-red-500 hover:from-red-500 hover:to-accent text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-elevated transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                onClick={() => {
                  document.querySelector('.products-section')?.scrollIntoView({ 
                    behavior: 'smooth' 
                  });
                }}
              >
                <ApperIcon name="ShoppingBag" size={20} />
                Shop Now
              </Button>
              <Button 
                variant="outline"
                className="border-2 border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-sm transition-all duration-300 flex items-center gap-2"
                onClick={() => {
                  document.querySelector('.products-section')?.scrollIntoView({ 
                    behavior: 'smooth' 
                  });
                }}
              >
                <ApperIcon name="Search" size={20} />
                Browse Products
              </Button>
            </div>
            
            {/* Features highlight */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-3 text-white/90">
                <ApperIcon name="Truck" size={24} className="text-accent" />
                <span className="font-medium">Fast Shipping</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-white/90">
                <ApperIcon name="Shield" size={24} className="text-accent" />
                <span className="font-medium">Secure Payment</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-white/90">
                <ApperIcon name="RotateCcw" size={24} className="text-accent" />
                <span className="font-medium">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="products-section bg-gray-50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold font-display text-primary">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of trending products with the best deals
            </p>
          </div>
          
          <ProductGrid />
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-gradient-to-r from-primary to-secondary py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold font-display text-white">
              Ready to Start Shopping?
            </h2>
            <p className="text-xl text-gray-200">
              Join thousands of satisfied customers and find your perfect products today
            </p>
            <Button 
              className="bg-gradient-to-r from-accent to-red-500 hover:from-red-500 hover:to-accent text-white px-10 py-4 text-lg font-semibold rounded-xl shadow-elevated transform hover:scale-105 transition-all duration-300 inline-flex items-center gap-2"
              onClick={() => {
                document.querySelector('.products-section')?.scrollIntoView({ 
                  behavior: 'smooth' 
                });
              }}
            >
              <ApperIcon name="ArrowRight" size={20} />
              Explore Products
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;