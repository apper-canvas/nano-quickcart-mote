import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="text-center space-y-8 max-w-md">
        <div className="relative">
          <div className="w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto shadow-soft">
            <ApperIcon name="Search" className="w-16 h-16 text-gray-500" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-6xl font-bold font-display text-primary">
            404
          </h1>
          <h2 className="text-2xl font-semibold font-display text-primary">
            Page Not Found
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Sorry, we couldn't find the page you're looking for. The page might have been moved or doesn't exist.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-accent to-red-500 hover:brightness-110"
          >
            <ApperIcon name="Home" className="w-5 h-5 mr-2" />
            Back to Home
          </Button>
          
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="border-2 border-accent text-accent hover:bg-accent hover:text-white"
          >
            <ApperIcon name="ArrowLeft" className="w-5 h-5 mr-2" />
            Go Back
          </Button>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Need help? Try searching for products or browse our categories.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;