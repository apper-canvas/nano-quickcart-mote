import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/utils/cn";
import ProductCard from "@/components/molecules/ProductCard";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import ApperIcon from "@/components/ApperIcon";
import { cartService } from "@/services/api/cartService";
import { toast } from "react-toastify";

export default function ProductCarousel({ 
  products = [], 
  loading = false, 
  title = "Related Products",
  className 
}) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    updateScrollButtons();
  }, [products]);

  const updateScrollButtons = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (direction) => {
    if (!scrollContainerRef.current) return;
    
    const scrollAmount = 320; // Width of one card + gap
    const newPosition = direction === 'left' 
      ? scrollPosition - scrollAmount 
      : scrollPosition + scrollAmount;
    
    scrollContainerRef.current.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });
    
    setScrollPosition(newPosition);
  };

  const handleAddToCart = async (product) => {
    try {
      await cartService.addItem(product, 1);
      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      toast.error("Failed to add item to cart");
    }
  };

  if (loading) {
    return (
      <div className={cn("py-8", className)}>
        <h2 className="text-2xl font-bold font-display text-primary mb-6">
          {title}
        </h2>
        <div className="flex justify-center">
          <Loading />
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className={cn("py-8", className)}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold font-display text-primary">
          {title}
        </h2>
        
        <div className="hidden md:flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="w-10 h-10 p-0 rounded-full border-2"
          >
            <ApperIcon name="ChevronLeft" size={16} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="w-10 h-10 p-0 rounded-full border-2"
          >
            <ApperIcon name="ChevronRight" size={16} />
          </Button>
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollContainerRef}
          onScroll={updateScrollButtons}
          className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitScrollbar: { display: 'none' }
          }}
        >
          {products.map((product) => (
            <div
              key={product.Id}
              className="flex-shrink-0 w-72 sm:w-80 snap-start"
            >
              <ProductCard
                product={product}
                onAddToCart={handleAddToCart}
                className="h-full"
              />
            </div>
          ))}
        </div>

        {/* Mobile scroll indicators */}
        <div className="flex justify-center mt-4 md:hidden">
          <div className="flex gap-2">
            {Array.from({ length: Math.ceil(products.length / 2) }).map((_, index) => (
              <div
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors duration-200",
                  index === Math.floor(scrollPosition / 320) 
                    ? "bg-accent" 
                    : "bg-gray-300"
                )}
              />
            ))}
          </div>
        </div>

        {/* Desktop gradient overlays */}
        <div className="hidden md:block">
          {canScrollLeft && (
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none" />
          )}
          {canScrollRight && (
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none" />
          )}
        </div>
      </div>
    </div>
  );
}