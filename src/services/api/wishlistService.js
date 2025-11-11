import wishlistData from '@/services/mockData/wishlistItems.json';
import { toast } from 'react-toastify';

// In-memory storage for wishlist items (simulating database)
let wishlistItems = [...wishlistData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const wishlistService = {
  // Get all wishlist items
  async getAll() {
    await delay(300);
    return [...wishlistItems];
  },

  // Check if product is in wishlist
  async isInWishlist(productId) {
    await delay(100);
    return wishlistItems.some(item => item.productId === productId);
  },

  // Add product to wishlist
  async add(productId) {
    await delay(200);
    
    if (wishlistItems.some(item => item.productId === productId)) {
      return { success: false, message: 'Product already in wishlist' };
    }

    const newItem = {
      Id: Math.max(0, ...wishlistItems.map(item => item.Id)) + 1,
      productId: productId,
      addedAt: new Date().toISOString()
    };

    wishlistItems.push(newItem);
    return { success: true, message: 'Added to wishlist', item: newItem };
  },

  // Remove product from wishlist
  async remove(productId) {
    await delay(200);
    
    const initialLength = wishlistItems.length;
    wishlistItems = wishlistItems.filter(item => item.productId !== productId);
    
    if (wishlistItems.length < initialLength) {
      return { success: true, message: 'Removed from wishlist' };
    } else {
      return { success: false, message: 'Product not found in wishlist' };
    }
  },

  // Toggle wishlist status
  async toggle(productId) {
    const isInWishlist = await this.isInWishlist(productId);
    
    if (isInWishlist) {
      return await this.remove(productId);
    } else {
      return await this.add(productId);
    }
  },

  // Clear all wishlist items
  async clear() {
    await delay(300);
    wishlistItems = [];
    return { success: true, message: 'Wishlist cleared' };
  }
};