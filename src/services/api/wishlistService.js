import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

export const wishlistService = {
  tableName: 'wishlist_items_c',

  // Get all wishlist items for current user
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
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
        console.error("Error fetching wishlist items:", response.message);
        return [];
      }

      return response.data.map(item => ({
        Id: item.Id,
        productId: item.product_id_c?.Id || item.product_id_c,
        addedAt: item.added_at_c
      }));
    } catch (error) {
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
        console.error("Error adding to wishlist:", response.message);
        toast.error(response.message);
        return { success: false, message: response.message };
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to add to wishlist:`, failed);
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
      console.error("Error adding to wishlist:", error?.response?.data?.message || error.message);
      return { success: false, message: 'Failed to add to wishlist' };
    }
  },

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
        console.error("Error removing from wishlist:", deleteResponse.message);
        toast.error(deleteResponse.message);
        return { success: false, message: deleteResponse.message };
      }

      toast.success('Removed from wishlist!');
      return { success: true, message: 'Removed from wishlist' };
    } catch (error) {
      console.error("Error removing from wishlist:", error?.response?.data?.message || error.message);
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
        console.error("Error clearing wishlist:", deleteResponse.message);
        toast.error(deleteResponse.message);
        return { success: false, message: deleteResponse.message };
      }

      toast.success('Wishlist cleared!');
      return { success: true, message: 'Wishlist cleared' };
    } catch (error) {
      console.error("Error clearing wishlist:", error?.response?.data?.message || error.message);
      return { success: false, message: 'Failed to clear wishlist' };
    }
  }
};