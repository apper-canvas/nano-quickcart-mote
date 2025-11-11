import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  className, 
  icon = "Package", 
  title = "No items found", 
  message = "There's nothing here yet.", 
  action,
  actionLabel = "Get Started"
}) => {
  return (
    <div className={cn("min-h-[400px] flex items-center justify-center p-8", className)}>
      <div className="text-center space-y-6 max-w-md">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto">
            <ApperIcon name={icon} className="w-12 h-12 text-gray-500" />
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-primary font-display">
            {title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {message}
          </p>
        </div>

        {action && (
          <div className="pt-2">
            <Button
              onClick={action}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-accent to-red-500 hover:brightness-110"
            >
              <ApperIcon name="Plus" size={16} />
              {actionLabel}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Empty;