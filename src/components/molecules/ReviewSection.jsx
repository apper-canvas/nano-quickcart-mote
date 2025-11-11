import React, { useEffect, useState } from "react";
import { reviewService } from "@/services/api/reviewService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import { cn } from "@/utils/cn";

function ReviewSection({ productId, className }) {
  const isCompact = className?.includes('compact');
const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    rating: 0,
    reviewerName: '',
    reviewText: ''
  });
  useEffect(() => {
    loadReviews();
  }, [productId]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      setError("");
      const reviewData = await reviewService.getByProductId(productId);
      setReviews(reviewData);
    } catch (err) {
      setError(err.message || "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating, size = "w-4 h-4") => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <ApperIcon
            key={i}
            name="Star"
            className={cn(size, "fill-yellow-400 text-yellow-400")}
          />
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <div key={i} className={cn("relative", size)}>
            <ApperIcon
              name="Star"
              className={cn(size, "text-gray-300 absolute")}
            />
            <ApperIcon
              name="Star"
              className={cn(size, "fill-yellow-400 text-yellow-400 absolute")}
              style={{ clipPath: "inset(0 50% 0 0)" }}
            />
          </div>
        );
      } else {
        stars.push(
          <ApperIcon
            key={i}
            name="Star"
            className={cn(size, "text-gray-300")}
          />
        );
      }
    }

    return stars;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className={cn("bg-white rounded-xl p-6 shadow-soft", className)}>
        <Loading className="h-32" />
      </div>
    );
  }

if (error || !reviews.length) {
    return (
      <div className={cn("bg-white rounded-xl shadow-soft", isCompact ? "p-4" : "p-6", className)}>
        <h3 className={cn("font-display font-semibold text-primary mb-3", isCompact ? "text-lg" : "text-xl")}>
          Customer Reviews
        </h3>
        <p className={cn("text-gray-500 text-center", isCompact ? "py-4 text-sm" : "py-8")}>
          {error || "No reviews available for this product yet."}
        </p>
      </div>
    );
  }

  // Handle form submission
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (formData.rating === 0 || !formData.reviewerName.trim() || !formData.reviewText.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);
      
      const reviewData = {
        productId: productId,
        rating: formData.rating,
        reviewerName: formData.reviewerName.trim(),
        reviewText: formData.reviewText.trim()
      };

      await reviewService.create(reviewData);
      
      // Reset form
      setFormData({
        rating: 0,
        reviewerName: '',
        reviewText: ''
      });
      setShowForm(false);
      
      // Refresh reviews list
      await loadReviews();
      
      toast.success("Review submitted successfully!");
      
    } catch (error) {
      toast.error(error.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };
  const averageRating = reviews.reduce((sum, review) => sum + (review?.rating || 0), 0) / reviews.length;
  const totalReviews = reviews.length;
  return (
<div className={cn("bg-white rounded-xl shadow-soft", isCompact ? "p-4" : "p-6", className)}>
<div className={isCompact ? "mb-4" : "mb-6"}>
        <div className={cn("flex items-center justify-between", isCompact ? "mb-4" : "mb-6")}>
          <h3 className={cn("font-display font-semibold text-primary", isCompact ? "text-lg" : "text-xl")}>
            Customer Reviews
          </h3>
          <Button
            onClick={() => setShowForm(!showForm)}
            variant="outline"
            className={cn("flex items-center gap-2", isCompact ? "text-sm px-3 py-2" : "")}
          >
            <ApperIcon name={showForm ? "X" : "Plus"} size={isCompact ? 14 : 16} />
            {showForm ? "Cancel" : "Write Review"}
          </Button>
        </div>

        {/* Review Form */}
{showForm && (
          <div className={cn("bg-gray-50 rounded-xl border border-gray-200", isCompact ? "mb-6 p-4" : "mb-8 p-6")}>
            <h4 className={cn("font-semibold text-primary mb-3", isCompact ? "text-base" : "text-lg")}>Write Your Review</h4>
            
            <form onSubmit={handleSubmitReview} className={isCompact ? "space-y-3" : "space-y-4"}>
              {/* Rating Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Rating *
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                      className="hover:scale-110 transition-transform"
                    >
                      <ApperIcon 
                        name="Star" 
                        size={isCompact ? 20 : 24}
                        className={star <= formData.rating 
                          ? "text-yellow-400 fill-current" 
                          : "text-gray-300"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Reviewer Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  value={formData.reviewerName}
                  onChange={(e) => setFormData(prev => ({ ...prev, reviewerName: e.target.value }))}
                  className={cn("w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent", isCompact ? "px-3 py-1.5 text-sm" : "px-3 py-2")}
                  placeholder="Enter your name"
                  required
                />
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review *
                </label>
                <textarea
                  value={formData.reviewText}
                  onChange={(e) => setFormData(prev => ({ ...prev, reviewText: e.target.value }))}
                  rows={isCompact ? 3 : 4}
                  className={cn("w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent resize-none", isCompact ? "px-3 py-1.5 text-sm" : "px-3 py-2")}
                  placeholder="Share your experience with this product..."
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className={isCompact ? "text-sm px-3 py-2" : ""}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting || formData.rating === 0}
                  className={cn("flex items-center gap-2", isCompact ? "text-sm px-3 py-2" : "")}
                >
                  {submitting && <ApperIcon name="Loader2" size={isCompact ? 14 : 16} className="animate-spin" />}
                  {submitting ? "Submitting..." : "Submit Review"}
                </Button>
              </div>
            </form>
          </div>
        )}
        
{/* Review Summary */}
        <div className={cn("flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-50 rounded-lg", isCompact ? "mb-4 p-3" : "mb-6 p-4")}>
          <div className="flex items-center gap-3 mb-3 sm:mb-0">
            <div className="flex items-center gap-1">
              {renderStars(averageRating, isCompact ? "w-4 h-4" : "w-5 h-5")}
            </div>
            <span className={cn("font-bold text-primary", isCompact ? "text-xl" : "text-2xl")}>
              {averageRating.toFixed(1)}
            </span>
            <span className={cn("text-gray-600", isCompact ? "text-sm" : "")}>
              out of 5
            </span>
          </div>
          <div className="text-sm text-gray-600">
            Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
          </div>
        </div>

{/* Rating Distribution */}
<div className={isCompact ? "mb-4" : "mb-8"}>
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = reviews.filter(r => r?.rating && Math.floor(r.rating) === stars).length;
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            return (
              <div key={stars} className={cn("flex items-center gap-3", isCompact ? "mb-1.5" : "mb-2")}>
                <span className={cn("font-medium text-gray-600 w-12", isCompact ? "text-xs" : "text-sm")}>
                  {stars} star
                </span>
                <div className={cn("flex-1 bg-gray-200 rounded-full", isCompact ? "h-1.5" : "h-2")}>
                  <div
                    className={cn("bg-yellow-400 rounded-full transition-all duration-300", isCompact ? "h-1.5" : "h-2")}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className={cn("text-gray-600 w-8", isCompact ? "text-xs" : "text-sm")}>
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Individual Reviews */}
<div className={cn("space-y-4", isCompact ? "space-y-3" : "space-y-6")}>
        {reviews.map((review) => (
          <div key={review?.Id || Math.random()} className={cn("border-b border-gray-100 last:border-b-0", isCompact ? "pb-3 last:pb-0" : "pb-6 last:pb-0")}>
            <div className={cn("flex flex-col sm:flex-row sm:items-start sm:justify-between", isCompact ? "mb-2" : "mb-3")}>
              <div className="flex items-center gap-3 mb-2 sm:mb-0">
                <div className={cn("bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold", isCompact ? "w-8 h-8 text-sm" : "w-10 h-10")}>
                  {review?.customerName?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div>
                  <h4 className={cn("font-medium text-primary", isCompact ? "text-sm" : "")}>
                    {review?.customerName || 'Anonymous'}
                  </h4>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {renderStars(review?.rating || 0, isCompact ? "w-3 h-3" : "")}
                    </div>
                    <span className={cn("text-gray-600", isCompact ? "text-xs" : "text-sm")}>
                      {(review?.rating || 0).toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
              <span className={cn("text-gray-500", isCompact ? "text-xs" : "text-sm")}>
                {review?.date ? formatDate(review.date) : 'Unknown date'}
              </span>
            </div>
            {review?.title && (
              <h5 className={cn("font-medium text-primary mb-2", isCompact ? "text-sm" : "")}>
                {review.title}
              </h5>
            )}
            
            <p className={cn("text-gray-700 leading-relaxed", isCompact ? "text-sm" : "")}>
              {review?.comment || 'No comment provided'}
            </p>
            
            {(review?.helpful || 0) > 0 && (
              <div className={cn("flex items-center gap-2 mt-2 text-gray-600", isCompact ? "text-xs" : "text-sm mt-3")}>
                <ApperIcon name="ThumbsUp" className={isCompact ? "w-3 h-3" : "w-4 h-4"} />
                <span>{review.helpful} people found this helpful</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReviewSection;