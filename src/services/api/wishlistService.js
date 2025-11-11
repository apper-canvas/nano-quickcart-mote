import { productService } from "./productService";
import { toast } from "react-toastify";
import React from "react";
import { getApperClient } from "@/services/apperClient";
export const wishlistService = {
  tableName: 'wishlist_items_c',

  // Get all wishlist items for current user
async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      // Validate user authentication for RLS policies
      try {
        const testResponse = await apperClient.fetchRecords('users', {
          fields: [{"field": {"Name": "Id"}}],
          pagingInfo: { limit: 1, offset: 0 }
        });
        
        if (!testResponse.success && testResponse.message?.includes('RLS')) {
          console.error("User not authenticated for database access");
          throw new Error('Authentication required for wishlist access');
        }
      } catch (authError) {
        if (authError.message?.includes('Authentication required')) {
          throw authError;
        }
        // Continue if it's not an auth error - user table might not exist
      }

      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "product_id_c"}},
          {"field": {"Name": "added_at_c"}}
        ],
        orderBy: [{"fieldName": "added_at_c", "sorttype": "DESC"}]
      });

      if (!response.success) {
        if (response.message?.includes('RLS') || response.message?.includes('policy')) {
          console.error("RLS policy error - user not authorized:", response.message);
          throw new Error('You must be logged in to access your wishlist');
        }
        console.error("Error fetching wishlist items:", response.message);
        return [];
      }

      return response.data.map(item => ({
        Id: item.Id,
        productId: item.product_id_c?.Id || item.product_id_c,
        addedAt: item.added_at_c
      }));
    } catch (error) {
      if (error.message?.includes('Authentication required') || error.message?.includes('logged in')) {
        console.error("Authentication error:", error.message);
        toast.error(error.message);
        throw error;
      }
      console.error("Error fetching wishlist items:", error?.response?.data?.message || error.message);
      return [];
    }
  },

  // Check if product is in wishlist
async isInWishlist(productId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        return false;
      }

      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [{"field": {"Name": "Id"}}],
        where: [{
          "FieldName": "product_id_c",
          "Operator": "EqualTo",
          "Values": [parseInt(productId)]
        }],
        pagingInfo: {
          "limit": 1,
          "offset": 0
        }
      });

      if (!response.success) {
        if (response.message?.includes('RLS') || response.message?.includes('policy')) {
          console.error("RLS policy error - user not authorized:", response.message);
          return false;
        }
        console.error("Error checking wishlist status:", response.message);
        return false;
      }

      return response.data && response.data.length > 0;
    } catch (error) {
      console.error("Error checking wishlist status:", error?.response?.data?.message || error.message);
      return false;
    }
  },

  // Add product to wishlist
async add(productId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      // Validate user authentication before attempting to add to wishlist
      try {
        const testResponse = await apperClient.fetchRecords('users', {
          fields: [{"field": {"Name": "Id"}}],
          pagingInfo: { limit: 1, offset: 0 }
        });
        
        if (!testResponse.success && testResponse.message?.includes('RLS')) {
          toast.error('Please log in to add items to your wishlist');
          return { success: false, message: 'Authentication required' };
        }
      } catch (authError) {
        // Continue if user table doesn't exist, RLS might be on wishlist table only
      }

      // Check if already in wishlist
      const alreadyInWishlist = await this.isInWishlist(productId);
      if (alreadyInWishlist) {
        return { success: false, message: 'Product already in wishlist' };
      }

      const payload = {
        records: [{
          Name: `Wishlist Item ${Date.now()}`,
          product_id_c: parseInt(productId),
          added_at_c: new Date().toISOString()
        }]
      };

      const response = await apperClient.createRecord(this.tableName, payload);

      if (!response.success) {
        if (response.message?.includes('RLS') || response.message?.includes('policy')) {
          console.error("RLS policy violation:", response.message);
          toast.error('Please log in to add items to your wishlist');
          return { success: false, message: 'Authentication required to add items to wishlist' };
        }
        
        if (response.message?.includes('permission') || response.message?.includes('access')) {
          console.error("Permission denied:", response.message);
          toast.error('You do not have permission to add items to this wishlist');
          return { success: false, message: 'Permission denied' };
        }

        console.error("Error adding to wishlist:", response.message);
        toast.error(response.message || 'Failed to add to wishlist');
        return { success: false, message: response.message || 'Failed to add to wishlist' };
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to add to wishlist:`, failed);
          
          // Check for RLS errors in failed results
          const rlsErrors = failed.filter(record => 
            record.message?.includes('RLS') || 
            record.message?.includes('policy') ||
            record.message?.includes('permission')
          );
          
          if (rlsErrors.length > 0) {
            toast.error('Please log in to add items to your wishlist');
            return { success: false, message: 'Authentication required' };
          }
          
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return { success: false, message: 'Failed to add to wishlist' };
        }

        if (successful.length > 0) {
          toast.success('Added to wishlist!');
          return { success: true, message: 'Added to wishlist', item: successful[0].data };
        }
      }

      return { success: false, message: 'Unexpected response format' };
    } catch (error) {
      if (error.message?.includes('RLS') || error.message?.includes('policy')) {
        console.error("RLS policy error:", error.message);
        toast.error('Please log in to add items to your wishlist');
        return { success: false, message: 'Authentication required' };
      }
      
      console.error("Error adding to wishlist:", error?.response?.data?.message || error.message);
      toast.error('Failed to add to wishlist');
      return { success: false, message: 'Failed to add to wishlist' };
    }
  },

  // Remove product from wishlist
// Remove product from wishlist
async remove(productId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      // First, find the wishlist item ID
      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [{"field": {"Name": "Id"}}],
        where: [{
          "FieldName": "product_id_c",
          "Operator": "EqualTo",
          "Values": [parseInt(productId)]
        }]
      });

      if (!response.success) {
        if (response.message?.includes('RLS') || response.message?.includes('policy')) {
          console.error("RLS policy error - user not authorized:", response.message);
          toast.error('Please log in to manage your wishlist');
          return { success: false, message: 'Authentication required' };
        }
        console.error("Error finding wishlist item:", response.message);
        return { success: false, message: response.message };
      }

      if (!response.data || response.data.length === 0) {
        return { success: false, message: 'Product not found in wishlist' };
      }

      // Delete the wishlist item
      const deleteResponse = await apperClient.deleteRecord(this.tableName, {
        RecordIds: response.data.map(item => item.Id)
      });

      if (!deleteResponse.success) {
        if (deleteResponse.message?.includes('RLS') || deleteResponse.message?.includes('policy')) {
          console.error("RLS policy error - user not authorized:", deleteResponse.message);
          toast.error('Please log in to remove items from your wishlist');
          return { success: false, message: 'Authentication required' };
        }
        console.error("Error removing from wishlist:", deleteResponse.message);
        toast.error(deleteResponse.message);
        return { success: false, message: deleteResponse.message };
      }

      // Verify successful deletion by checking results if available
      if (deleteResponse.results) {
        const successful = deleteResponse.results.filter(r => r.success);
        const failed = deleteResponse.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} wishlist items:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return { success: false, message: 'Failed to remove from wishlist' };
        }
        
        if (successful.length === 0) {
          return { success: false, message: 'No items were removed from wishlist' };
        }
      }

      toast.success('Removed from wishlist!');
      return { success: true, message: 'Removed from wishlist', deletedCount: response.data.length };
    } catch (error) {
      if (error.message?.includes('RLS') || error.message?.includes('policy')) {
        console.error("RLS policy error:", error.message);
        toast.error('Please log in to manage your wishlist');
        return { success: false, message: 'Authentication required' };
      }
      console.error("Error removing from wishlist:", error?.response?.data?.message || error.message);
      toast.error('Failed to remove from wishlist');
return { success: false, message: 'Failed to remove from wishlist' };
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
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      // Get all wishlist items first
      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [{"field": {"Name": "Id"}}]
      });

      if (!response.success) {
        if (response.message?.includes('RLS') || response.message?.includes('policy')) {
          console.error("RLS policy error - user not authorized:", response.message);
          toast.error('Please log in to clear your wishlist');
          return { success: false, message: 'Authentication required' };
        }
        console.error("Error fetching wishlist items to clear:", response.message);
        return { success: false, message: response.message };
      }

      if (!response.data || response.data.length === 0) {
        return { success: true, message: 'Wishlist already empty' };
      }

      // Delete all items
      const deleteResponse = await apperClient.deleteRecord(this.tableName, {
        RecordIds: response.data.map(item => item.Id)
      });

      if (!deleteResponse.success) {
        if (deleteResponse.message?.includes('RLS') || deleteResponse.message?.includes('policy')) {
          console.error("RLS policy error - user not authorized:", deleteResponse.message);
          toast.error('Please log in to clear your wishlist');
          return { success: false, message: 'Authentication required' };
        }
        console.error("Error clearing wishlist:", deleteResponse.message);
        toast.error(deleteResponse.message);
        return { success: false, message: deleteResponse.message };
      }

      toast.success('Wishlist cleared!');
      return { success: true, message: 'Wishlist cleared' };
    } catch (error) {
      if (error.message?.includes('RLS') || error.message?.includes('policy')) {
        console.error("RLS policy error:", error.message);
        toast.error('Please log in to clear your wishlist');
        return { success: false, message: 'Authentication required' };
      }
      console.error("Error clearing wishlist:", error?.response?.data?.message || error.message);
      return { success: false, message: 'Failed to clear wishlist' };
    }
  },

  // Get wishlist items with complete product details
  async getWishlistWithProducts() {
    try {
      const wishlistItems = await this.getAll();
      
      if (wishlistItems.length === 0) {
        return [];
      }

      // Fetch product details for each wishlist item
      const itemsWithProducts = await Promise.all(
        wishlistItems.map(async (item) => {
          try {
            const product = await productService.getById(item.productId);
            return {
              ...item,
              product: product || null
            };
          } catch (error) {
            console.error(`Error fetching product ${item.productId}:`, error);
            return {
              ...item,
              product: null
            };
          }
        })
      );

      return itemsWithProducts;
    } catch (error) {
      console.error("Error fetching wishlist with products:", error?.response?.data?.message || error.message);
      return [];
    }
  }
};