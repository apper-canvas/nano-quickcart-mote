import React, { useState } from "react";
import { cn } from "@/utils/cn";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";

const SearchBar = ({ 
  className, 
  placeholder = "Search products...", 
  onSearch,
  value,
  onChange
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch && value) {
      onSearch(value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <div className="relative">
        <ApperIcon 
          name="Search" 
          className={cn(
            "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors duration-200",
            isFocused ? "text-accent" : "text-gray-400"
          )} 
        />
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="pl-10 pr-4 h-12 text-base rounded-xl border-2 focus:border-accent"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange?.({ target: { value: "" } })}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary transition-colors duration-200"
          >
            <ApperIcon name="X" className="w-4 h-4" />
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;