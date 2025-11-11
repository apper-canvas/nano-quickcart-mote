import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { cn } from "@/utils/cn";
import ProductCard from "@/components/molecules/ProductCard";
import CategoryFilter from "@/components/molecules/CategoryFilter";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import { productService } from "@/services/api/productService";
import { cartService } from "@/services/api/cartService";
import { toast } from "react-toastify";

const ProductGrid = ({ className }) => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const searchQuery = searchParams.get("search");
    const categoryParam = searchParams.get("category");
    
    if (searchQuery) {
      handleSearch(searchQuery);
    } else if (categoryParam) {
      setSelectedCategory(categoryParam);
      filterByCategory(categoryParam);
    } else {
      loadProducts();
    }
  }, [searchParams]);

  const loadData = async () => {
    try {
      setError("");
      const [productsData, categoriesData] = await Promise.all([
        productService.getAll(),
        productService.getCategories()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await productService.getAll();
      setProducts(data);
      setSelectedCategory("");
    } catch (err) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    try {
      setLoading(true);
      setError("");
      const data = await productService.searchProducts(query);
      setProducts(data);
      setSelectedCategory("");
    } catch (err) {
      setError(err.message || "Failed to search products");
    } finally {
      setLoading(false);
    }
  };

  const filterByCategory = async (category) => {
    if (!category) {
      loadProducts();
      return;
    }

    try {
      setLoading(true);
      setError("");
      const data = await productService.getByCategory(category);
      setProducts(data);
    } catch (err) {
      setError(err.message || "Failed to filter products");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    filterByCategory(category);
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
      <div className={cn("space-y-8", className)}>
        <div className="h-12 bg-gray-200 rounded w-64 animate-pulse"></div>
        <Loading variant="grid" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorView 
        message={error} 
        onRetry={loadData}
        className={className}
      />
    );
  }

  return (
    <div className={cn("space-y-8", className)}>
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      {products.length === 0 ? (
        <Empty
          icon="Package"
          title="No products found"
          message="Try adjusting your search or browse all categories."
          action={loadProducts}
          actionLabel="View All Products"
        />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold font-display text-primary">
              {selectedCategory ? `${selectedCategory} Products` : "All Products"}
            </h2>
            <span className="text-sm text-gray-600">
              {products.length} product{products.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.Id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductGrid;