import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { productService } from "@/services/api/productService";
import { cartService } from "@/services/api/cartService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import ReviewSection from "@/components/molecules/ReviewSection";
import ProductCarousel from "@/components/molecules/ProductCarousel";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import { cn } from "@/utils/cn";
const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [zipCode, setZipCode] = useState("");

  const handleZipCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    setZipCode(value);
  };

  const handleZipCodeSearch = () => {
    if (zipCode && zipCode.length === 5) {
      // Simulate delivery date calculation based on ZIP code
      toast.info(`Delivery estimates updated for ZIP code ${zipCode}`);
    } else {
      toast.error("Please enter a valid 5-digit ZIP code");
    }
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

const loadProduct = async () => {
    try {
      setError("");
      setLoading(true);
      const productData = await productService.getById(id);
      setProduct(productData);
      setSelectedImage(0);
      
      // Load related products after main product loads
      loadRelatedProducts(productData);
    } catch (err) {
      setError(err.message || "Product not found");
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedProducts = async (currentProduct) => {
    try {
      setLoadingRelated(true);
      const related = await productService.getRelated(currentProduct.Id, currentProduct.category);
      setRelatedProducts(related);
    } catch (err) {
      console.error("Failed to load related products:", err);
    } finally {
      setLoadingRelated(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      await cartService.addItem(product, quantity);
      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      toast.error("Failed to add item to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    try {
      await cartService.addItem(product, quantity);
      navigate("/cart");
    } catch (err) {
      toast.error("Failed to add item to cart");
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(price);
  };

  if (loading) {
    return <Loading />;
  }

  if (error || !product) {
    return (
      <ErrorView 
        message={error || "Product not found"} 
        onRetry={loadProduct}
      />
    );
  }

  const isLowStock = product.stock < 10;
  const isOutOfStock = product.stock === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
            <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 hover:bg-white/80">
                <ApperIcon name="ArrowLeft" size={16} />Back to Products
                                          </Button>
        </div>
        <div className="bg-white rounded-2xl shadow-elevated overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
                {/* Image Gallery */}
                <div className="space-y-4">
                    <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                        <img
                            src={product.images[selectedImage]}
                            alt={product.name}
                            className="w-full h-full object-cover" />
                    </div>
                    {product.images.length > 1 && <div className="flex gap-2 overflow-x-auto">
                        {product.images.map((image, index) => <button
                            key={index}
                            onClick={() => setSelectedImage(index)}
                            className={cn(
                                "flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200",
                                selectedImage === index ? "border-accent shadow-soft" : "border-gray-200 hover:border-gray-300"
                            )}>
                            <img
                                src={image}
                                alt={`${product.name} ${index + 1}`}
                                className="w-full h-full object-cover" />
                        </button>)}
                    </div>}
                </div>
                {/* Product Info */}
                <div className="space-y-6">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" size="sm">
                                {product.category}
                            </Badge>
                            {isLowStock && !isOutOfStock && <Badge variant="warning" size="sm">Only {product.stock}left
                                                                                    </Badge>}
                            {isOutOfStock && <Badge variant="error" size="sm">Out of Stock
                                                                                    </Badge>}
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-bold font-display text-primary">
                            {product.name}
                        </h1>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                                {Array.from({
                                    length: 5
                                }).map((_, i) => <ApperIcon
                                    key={i}
                                    name="Star"
                                    className={cn(
                                        "w-5 h-5",
                                        i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                    )} />)}
                                <span className="font-medium text-primary ml-1">
                                    {product.rating}
                                </span>
                            </div>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-600">
                                {product.reviews}reviews
                                                                                  </span>
                        </div>
                    </div>
                    {/* Pricing and Availability Section */}
                    <div
                        className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200">
                        {/* Pricing */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 flex-wrap">
                                {/* Check if product has discount (simulate 25% discount for products with ID divisible by 3) */}
                                {product.Id % 3 === 0 ? <>
                                    {/* Current Price */}
                                    <span className="text-5xl lg:text-6xl font-bold text-accent font-display">
                                        {formatPrice(product.price * 0.75)}
                                    </span>
                                    {/* Original Price */}
                                    <span className="text-2xl font-semibold text-gray-500 line-through">
                                        {formatPrice(product.price)}
                                    </span>
                                    {/* Discount Badge */}
                                    <Badge variant="discount" size="sm" className="px-3 py-1 text-sm">25% OFF
                                                                                                        </Badge>
                                </> : <span className="text-5xl lg:text-6xl font-bold text-accent font-display">
                                    {formatPrice(product.price)}
                                </span>}
                            </div>
                            {/* Savings Message */}
                            {product.Id % 3 === 0 && <div className="flex items-center gap-2">
                                <ApperIcon name="CheckCircle" className="w-5 h-5 text-success" />
                                <span className="text-success font-semibold">You save {formatPrice(product.price * 0.25)}(25%)
                                                                                              </span>
                            </div>}
                        </div>
                        {/* Availability Status */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                {isOutOfStock ? <>
                                    <ApperIcon name="X" className="w-5 h-5 text-error" />
                                    <span className="text-error font-semibold">Out of Stock</span>
                                </> : isLowStock ? <>
                                    <ApperIcon name="AlertTriangle" className="w-5 h-5 text-warning" />
                                    <span className="text-warning font-semibold">Only {product.stock}left</span>
                                </> : <>
                                    <ApperIcon name="CheckCircle" className="w-5 h-5 text-success" />
                                    <span className="text-success font-semibold">In Stock</span>
                                </>}
                            </div>
                            {/* Delivery Information */}
                            {!isOutOfStock && <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <ApperIcon name="Truck" className="w-5 h-5 text-primary" />
                                    <span className="text-primary font-medium">Get it by Friday, Nov 15
                                                                                                        </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="relative flex-1 max-w-xs">
                                        <Input
                                            type="text"
                                            placeholder="Enter ZIP code (e.g., 12345)"
                                            value={zipCode}
                                            onChange={handleZipCodeChange}
                                            className="pr-10 text-sm"
                                            maxLength={5} />
                                        <button
                                            onClick={handleZipCodeSearch}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary transition-colors"
                                            type="button">
                                            <ApperIcon name="Search" className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>}
                        </div>
                        {/* Free Shipping Notice */}
                        <div className="pt-4 border-t border-gray-200">
                            <p className="text-sm text-gray-600 flex items-center gap-2">
                                <ApperIcon name="Package" className="w-4 h-4" />Free shipping on orders over $50
                                                                                  </p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <h3 className="font-semibold text-primary">Description</h3>
                        <p className="text-gray-700 leading-relaxed">
                            {product.description}
                        </p>
                    </div>
                    {/* Quantity and Purchase Actions - Moved above specifications */}
                    <div className="space-y-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-4">
                            <label className="font-medium text-primary">Quantity:</label>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    disabled={quantity <= 1}
                                    className="w-8 h-8 p-0">
                                    <ApperIcon name="Minus" size={14} />
                                </Button>
                                <span className="w-12 text-center font-medium text-lg">
                                    {quantity}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setQuantity(quantity + 1)}
                                    disabled={quantity >= product.stock}
                                    className="w-8 h-8 p-0">
                                    <ApperIcon name="Plus" size={14} />
                                </Button>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Button
                                size="lg"
                                onClick={handleAddToCart}
                                disabled={isOutOfStock || addingToCart}
                                className="flex-1 bg-gradient-to-r from-accent to-red-500 hover:brightness-110">
                                {addingToCart ? <>
                                    <ApperIcon name="Loader2" className="w-5 h-5 mr-2 animate-spin" />Adding...
                                                                                              </> : <>
                                    <ApperIcon name="ShoppingCart" className="w-5 h-5 mr-2" />Add to Cart
                                                                                              </>}
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={handleBuyNow}
                                disabled={isOutOfStock}
                                className="flex-1 border-2 border-accent text-accent hover:bg-accent hover:text-white">
                                <ApperIcon name="Zap" className="w-5 h-5 mr-2" />Buy Now
                                                                                  </Button>
                        </div>
                        {isOutOfStock && <p className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">This item is currently out of stock
                                                                          </p>}
                    </div>
                    {/* Enhanced Product Specifications */}
                    <div className="bg-white rounded-xl p-6 shadow-soft">
                        <h3 className="text-xl font-display font-semibold text-primary mb-4">Product Specifications
                                                                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <div
                                    className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="font-medium text-gray-600">Brand:</span>
                                    <span className="text-primary font-semibold">{product.brand || "Not specified"}</span>
                                </div>
                                <div
                                    className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="font-medium text-gray-600">Category:</span>
                                    <span className="text-primary">{product.category}</span>
                                </div>
                                <div
                                    className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="font-medium text-gray-600">SKU:</span>
                                    <span className="text-primary font-mono text-sm">{product.Id || "N/A"}</span>
                                </div>
                                <div
                                    className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="font-medium text-gray-600">Material:</span>
                                    <span className="text-primary">{product.material || "Premium Quality"}</span>
                                </div>
                                <div
                                    className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="font-medium text-gray-600">Color Options:</span>
                                    <span className="text-primary">{product.colors || "Multiple Available"}</span>
                                </div>
                                <div
                                    className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="font-medium text-gray-600">Warranty:</span>
                                    <span className="text-primary">{product.warranty || "1 Year Limited"}</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div
                                    className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="font-medium text-gray-600">Availability:</span>
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-semibold ${product.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                        {product.inStock ? "In Stock" : "Out of Stock"}
                                    </span>
                                </div>
                                <div
                                    className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="font-medium text-gray-600">Weight:</span>
                                    <span className="text-primary">{product.weight || "Not specified"}</span>
                                </div>
                                <div
                                    className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="font-medium text-gray-600">Dimensions:</span>
                                    <span className="text-primary">{product.dimensions || "Not specified"}</span>
                                </div>
                                <div
                                    className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="font-medium text-gray-600">Shipping Weight:</span>
                                    <span className="text-primary">{product.shippingWeight || "2.5 lbs"}</span>
                                </div>
                                <div
                                    className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="font-medium text-gray-600">Origin:</span>
                                    <span className="text-primary">{product.origin || "Imported"}</span>
                                </div>
                                <div
                                    className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="font-medium text-gray-600">Model Number:</span>
                                    <span className="text-primary font-mono text-sm">{product.modelNumber || `QC-${product.Id}-${product.category?.slice(0, 2).toUpperCase()}`}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Reviews Section - Moved below specifications */}
                    <ReviewSection productId={product.Id} className="compact" />
                </div>
            </div>
        </div>
        {/* Related Products Carousel - Full Width Section */}
        <div className="bg-gray-50 py-16 mt-12">
            <ProductCarousel
                products={relatedProducts}
                loading={loadingRelated}
                title="You might also like"
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" />
        </div></div></div>
  );
};

export default ProductDetailPage;