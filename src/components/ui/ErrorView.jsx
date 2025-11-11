import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const ErrorView = ({ 
  className, 
  message = "Something went wrong", 
  onRetry, 
  showRetry = true 
}) => {
  return (
    <div className={cn("min-h-[400px] flex items-center justify-center p-8", className)}>
      <div className="text-center space-y-6 max-w-md">
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto">
            <ApperIcon name="AlertTriangle" className="w-10 h-10 text-red-600" />
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-primary font-display">
            Oops! Something went wrong
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {message}
          </p>
        </div>

        {showRetry && onRetry && (
          <div className="pt-2">
            <Button
              onClick={onRetry}
              variant="outline"
              className="inline-flex items-center gap-2"
            >
              <ApperIcon name="RotateCcw" size={16} />
              Try Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorView;