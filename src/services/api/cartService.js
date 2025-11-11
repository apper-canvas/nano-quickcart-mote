import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

class CartService {
  constructor() {
    this.storageKey = "quickcart_cart";
    this.tableName = 'products_c';
    this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      this.cartItems = stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error loading cart from storage:", error);
      this.cartItems = [];
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.cartItems));
    } catch (error) {
      console.error("Error saving cart to storage:", error);
    }
  }

  async getAll() {
    try {
      // Get cart items with product details from database
      const cartItems = [];
      const apperClient = getApperClient();
      
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      for (const item of this.cartItems) {
        try {
          const response = await apperClient.getRecordById(this.tableName, parseInt(item.productId), {
            fields: [
              {"field": {"Name": "Id"}},
              {"field": {"Name": "name_c"}},
              {"field": {"Name": "price_c"}},
              {"field": {"Name": "images_c"}},
              {"field": {"Name": "stock_c"}}
            ]
          });

          if (response.success && response.data) {
            cartItems.push({
              productId: item.productId,
              quantity: item.quantity,
              price: response.data.price_c || item.price,
              name: response.data.name_c || item.name,
              image: response.data.images_c ? response.data.images_c.split(',')[0].trim() : item.image,
              stock: response.data.stock_c || 0
            });
          }
        } catch (productError) {
          console.error(`Error fetching product ${item.productId}:`, productError);
          // Keep the cached item data if product fetch fails
          cartItems.push(item);
        }
      }

      return cartItems;
    } catch (error) {
      console.error("Error getting cart items:", error?.response?.data?.message || error.message);
      return this.cartItems; // Return cached items as fallback
    }
  }

async addItem(product, quantity = 1) {
    try {
      // Validate product object and required properties
      if (!product) {
        throw new Error('Product is required');
      }

      if (!product.Id && product.Id !== 0) {
        throw new Error('Product ID is required');
      }

      if (!product.name) {
        throw new Error('Product name is required');
      }

      if (typeof product.price !== 'number' || product.price < 0) {
        throw new Error('Valid product price is required');
      }

      // Convert product ID to string safely
      const productId = product.Id.toString();

      const existingItemIndex = this.cartItems.findIndex(
        item => item.productId === productId
      );

      if (existingItemIndex >= 0) {
        this.cartItems[existingItemIndex].quantity += quantity;
      } else {
        const newItem = {
          productId: productId,
          quantity,
          price: product.price,
          name: product.name,
          image: product.images?.[0] || ''
        };
        this.cartItems.push(newItem);
      }

      this.saveToStorage();
      return await this.getAll();
    } catch (error) {
      console.error("Error adding item to cart:", error?.response?.data?.message || error.message);
      throw error;
    }
  }

  async updateQuantity(productId, quantity) {
    try {
      const itemIndex = this.cartItems.findIndex(
        item => item.productId === productId.toString()
      );

      if (itemIndex >= 0) {
        if (quantity <= 0) {
          this.cartItems.splice(itemIndex, 1);
        } else {
          this.cartItems[itemIndex].quantity = quantity;
        }
        this.saveToStorage();
      }

      return await this.getAll();
    } catch (error) {
      console.error("Error updating cart quantity:", error?.response?.data?.message || error.message);
      throw error;
    }
  }

  async removeItem(productId) {
    try {
      this.cartItems = this.cartItems.filter(
        item => item.productId !== productId.toString()
      );
      this.saveToStorage();
      return await this.getAll();
    } catch (error) {
      console.error("Error removing cart item:", error?.response?.data?.message || error.message);
      throw error;
    }
  }

  async clear() {
    try {
      this.cartItems = [];
      this.saveToStorage();
      return [];
    } catch (error) {
      console.error("Error clearing cart:", error?.response?.data?.message || error.message);
      throw error;
    }
  }

  async getItemCount() {
    try {
      const count = this.cartItems.reduce((total, item) => total + item.quantity, 0);
      return count;
    } catch (error) {
      console.error("Error getting cart item count:", error?.response?.data?.message || error.message);
      return 0;
    }
  }

  async getTotal() {
    try {
      const items = await this.getAll();
      const total = items.reduce(
        (sum, item) => sum + (item.price * item.quantity), 0
      );
      return total;
    } catch (error) {
      console.error("Error calculating cart total:", error?.response?.data?.message || error.message);
      return 0;
    }
  }
}

export const cartService = new CartService();