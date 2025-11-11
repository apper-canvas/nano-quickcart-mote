import { productService } from "@/services/api/productService";

class ReviewService {
  constructor() {
    this.reviews = new Map(); // Cache for generated reviews
  }

  // Generate realistic reviews based on product data
  generateReviewsForProduct(product) {
    const reviewCount = product.reviews || 0;
    const rating = product.rating || 4.0;
    
    if (reviewCount === 0) return [];

    const reviews = [];
    const customerNames = [
      "Sarah Johnson", "Michael Chen", "Emily Rodriguez", "David Thompson", 
      "Jessica Lee", "Robert Wilson", "Amanda Garcia", "Christopher Brown",
      "Lisa Wang", "Andrew Davis", "Maria Gonzalez", "Kevin Anderson",
      "Rachel Taylor", "James Miller", "Ashley Martinez", "Daniel Clark",
      "Samantha Lewis", "Tyler Hall", "Nicole Walker", "Brandon Young"
    ];

    const reviewTitles = {
      5: ["Excellent quality!", "Love this product!", "Highly recommend!", "Perfect!", "Outstanding!"],
      4: ["Great product", "Very satisfied", "Good value", "Would buy again", "Nice quality"],
      3: ["It's okay", "Average product", "Does the job", "Fair quality", "Not bad"],
      2: ["Could be better", "Disappointed", "Below expectations", "Not worth it", "Poor quality"],
      1: ["Terrible", "Waste of money", "Very poor", "Don't buy", "Awful quality"]
    };

    const positiveComments = [
      "This product exceeded my expectations! The quality is fantastic and it works perfectly.",
      "Great value for money. I've been using it for months and it's still going strong.",
      "Shipping was fast and the product arrived in perfect condition. Very happy with my purchase.",
      "Exactly what I was looking for. The quality is excellent and it looks great.",
      "I love this product! It's well made and does exactly what it's supposed to do.",
      "Outstanding quality and great customer service. Will definitely shop here again.",
      "Perfect fit and finish. I'm very impressed with the attention to detail.",
      "This has become one of my favorite purchases. Highly recommend to anyone.",
      "Excellent product that delivers on all its promises. Worth every penny.",
      "Great design and functionality. I use it every day and it never disappoints."
    ];

    const neutralComments = [
      "It's an okay product. Does what it says but nothing special.",
      "Average quality for the price. Not amazing but not terrible either.",
      "It works fine but I expected a bit more for the price I paid.",
      "Decent product overall. Some minor issues but generally satisfied.",
      "It's good enough for what I needed. Would consider other options next time.",
      "Fair quality product. It gets the job done but could be improved.",
      "Not bad, but not great either. It's just an average product.",
      "It works as expected. Nothing to complain about but nothing to rave about."
    ];

    const negativeComments = [
      "Quality is not what I expected. The product feels cheap and poorly made.",
      "Had issues with this product right out of the box. Very disappointed.",
      "Not worth the price. There are much better alternatives available.",
      "Poor build quality and it stopped working after just a few uses.",
      "Very disappointed with this purchase. Would not recommend to others.",
      "The product doesn't match the description. Quality is subpar.",
      "Had to return this item due to defects. Poor quality control."
    ];

    // Generate reviews with realistic distribution around the average rating
    for (let i = 0; i < Math.min(reviewCount, 20); i++) { // Limit to 20 reviews for performance
      const variance = (Math.random() - 0.5) * 2; // -1 to 1
      let reviewRating = Math.round(rating + variance);
      reviewRating = Math.max(1, Math.min(5, reviewRating)); // Clamp between 1-5

      const customerName = customerNames[Math.floor(Math.random() * customerNames.length)];
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 365)); // Random date within last year

      let comment;
      let title = "";
      
      if (reviewRating >= 4) {
        comment = positiveComments[Math.floor(Math.random() * positiveComments.length)];
        title = reviewTitles[reviewRating][Math.floor(Math.random() * reviewTitles[reviewRating].length)];
      } else if (reviewRating === 3) {
        comment = neutralComments[Math.floor(Math.random() * neutralComments.length)];
        title = reviewTitles[3][Math.floor(Math.random() * reviewTitles[3].length)];
      } else {
        comment = negativeComments[Math.floor(Math.random() * negativeComments.length)];
        title = reviewTitles[reviewRating][Math.floor(Math.random() * reviewTitles[reviewRating].length)];
      }

      reviews.push({
        Id: i + 1,
        productId: product.Id,
        customerName: customerName,
        rating: reviewRating,
        title: Math.random() > 0.3 ? title : "", // 70% chance of having a title
        comment: comment,
        date: date.toISOString(),
        helpful: Math.floor(Math.random() * 10), // 0-9 helpful votes
        verified: Math.random() > 0.2 // 80% chance of being verified purchase
      });
    }

    // Sort by most recent first
    reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return reviews;
  }

  async getByProductId(productId) {
    return new Promise(async (resolve, reject) => {
      try {
        // Check cache first
        if (this.reviews.has(productId)) {
          setTimeout(() => {
            resolve([...this.reviews.get(productId)]);
          }, 300);
          return;
        }

        // Get product data to generate realistic reviews
        const product = await productService.getById(productId);
        const generatedReviews = this.generateReviewsForProduct(product);
        
        // Cache the generated reviews
        this.reviews.set(productId, generatedReviews);
        
        setTimeout(() => {
          resolve([...generatedReviews]);
        }, 300);
      } catch (err) {
        setTimeout(() => {
          reject(new Error("Failed to load reviews"));
        }, 300);
      }
    });
  }

  async getById(reviewId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Search through all cached reviews
        for (const [, reviews] of this.reviews) {
          const review = reviews.find(r => r.Id === parseInt(reviewId));
          if (review) {
            resolve({ ...review });
            return;
          }
        }
        reject(new Error("Review not found"));
      }, 200);
    });
  }

  async create(reviewData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const productId = reviewData.productId;
        if (!this.reviews.has(productId)) {
          this.reviews.set(productId, []);
        }
        
        const reviews = this.reviews.get(productId);
        const newReview = {
          ...reviewData,
          Id: reviews.length + 1,
          date: new Date().toISOString(),
          helpful: 0,
          verified: true
        };
        
        reviews.unshift(newReview); // Add to beginning (most recent)
        resolve({ ...newReview });
      }, 400);
    });
  }

  async getAverageRating(productId) {
    return new Promise(async (resolve, reject) => {
      try {
        const reviews = await this.getByProductId(productId);
        if (reviews.length === 0) {
          resolve(0);
          return;
        }
        
        const average = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
        resolve(parseFloat(average.toFixed(1)));
      } catch (err) {
        reject(err);
      }
    });
  }
}

export const reviewService = new ReviewService();