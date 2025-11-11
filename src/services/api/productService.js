import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

class ProductService {
  constructor() {
    this.tableName = 'products_c';
  }

  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "original_price_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "reviews_c"}},
          {"field": {"Name": "stock_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "brand_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "material_c"}},
          {"field": {"Name": "colors_c"}},
          {"field": {"Name": "warranty_c"}},
          {"field": {"Name": "weight_c"}},
          {"field": {"Name": "dimensions_c"}},
          {"field": {"Name": "origin_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error("Error fetching products:", response.message);
        toast.error(response.message);
        return [];
      }

      // Transform database fields to expected format
      return response.data.map(this.transformProduct);
    } catch (error) {
      console.error("Error fetching products:", error?.response?.data?.message || error.message);
      return [];
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const response = await apperClient.getRecordById(this.tableName, parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "original_price_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "reviews_c"}},
          {"field": {"Name": "stock_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "brand_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "material_c"}},
          {"field": {"Name": "colors_c"}},
          {"field": {"Name": "warranty_c"}},
          {"field": {"Name": "weight_c"}},
          {"field": {"Name": "dimensions_c"}},
          {"field": {"Name": "origin_c"}}
        ]
      });

      if (!response.success) {
        console.error("Error fetching product:", response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error("Product not found");
      }

      return this.transformProduct(response.data);
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error?.response?.data?.message || error.message);
      throw error;
    }
  }

  async getByCategory(category) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "original_price_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "reviews_c"}},
          {"field": {"Name": "stock_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "brand_c"}},
          {"field": {"Name": "in_stock_c"}}
        ],
        where: [{
          "FieldName": "category_c",
          "Operator": "EqualTo",
          "Values": [category]
        }],
        orderBy: [{"fieldName": "rating_c", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error("Error fetching products by category:", response.message);
        return [];
      }

      return response.data.map(this.transformProduct);
    } catch (error) {
      console.error("Error fetching products by category:", error?.response?.data?.message || error.message);
      return [];
    }
  }

  async searchProducts(query) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "original_price_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "reviews_c"}},
          {"field": {"Name": "stock_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "brand_c"}},
          {"field": {"Name": "in_stock_c"}}
        ],
        whereGroups: [{
          "operator": "OR",
          "subGroups": [
            {
              "conditions": [
                {
                  "fieldName": "name_c",
                  "operator": "Contains",
                  "values": [query]
                }
              ]
            },
            {
              "conditions": [
                {
                  "fieldName": "category_c", 
                  "operator": "Contains",
                  "values": [query]
                }
              ]
            },
            {
              "conditions": [
                {
                  "fieldName": "description_c",
                  "operator": "Contains", 
                  "values": [query]
                }
              ]
            }
          ]
        }]
      });

      if (!response.success) {
        console.error("Error searching products:", response.message);
        return [];
      }

      return response.data.map(this.transformProduct);
    } catch (error) {
      console.error("Error searching products:", error?.response?.data?.message || error.message);
      return [];
    }
  }

  async getRelated(productId, category, limit = 4) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "original_price_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "reviews_c"}},
          {"field": {"Name": "stock_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "brand_c"}},
          {"field": {"Name": "in_stock_c"}}
        ],
        where: [
          {
            "FieldName": "category_c",
            "Operator": "EqualTo",
            "Values": [category]
          },
          {
            "FieldName": "Id",
            "Operator": "NotEqualTo", 
            "Values": [parseInt(productId)]
          }
        ],
        orderBy: [{"fieldName": "rating_c", "sorttype": "DESC"}],
        pagingInfo: {
          "limit": limit,
          "offset": 0
        }
      });

      if (!response.success) {
        console.error("Error fetching related products:", response.message);
        return [];
      }

      return response.data.map(this.transformProduct);
    } catch (error) {
      console.error("Error fetching related products:", error?.response?.data?.message || error.message);
      return [];
    }
  }

  async getCategories() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [{"field": {"Name": "category_c"}}],
        groupBy: ["category_c"]
      });

      if (!response.success) {
        console.error("Error fetching categories:", response.message);
        return [];
      }

      return [...new Set(response.data.map(item => item.category_c).filter(Boolean))];
    } catch (error) {
      console.error("Error fetching categories:", error?.response?.data?.message || error.message);
      return [];
    }
  }

  async getFeatured() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "original_price_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "reviews_c"}},
          {"field": {"Name": "stock_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "brand_c"}},
          {"field": {"Name": "in_stock_c"}}
        ],
        where: [{
          "FieldName": "rating_c",
          "Operator": "GreaterThanOrEqualTo",
          "Values": ["4.7"]
        }],
        orderBy: [{"fieldName": "reviews_c", "sorttype": "DESC"}],
        pagingInfo: {
          "limit": 6,
          "offset": 0
        }
      });

      if (!response.success) {
        console.error("Error fetching featured products:", response.message);
        return [];
      }

      return response.data.map(this.transformProduct);
    } catch (error) {
      console.error("Error fetching featured products:", error?.response?.data?.message || error.message);
      return [];
    }
  }

  // Transform database product to expected format
  transformProduct(dbProduct) {
    return {
      Id: dbProduct.Id,
      name: dbProduct.name_c || '',
      category: dbProduct.category_c || '',
      description: dbProduct.description_c || '',
      price: dbProduct.price_c || 0,
      originalPrice: dbProduct.original_price_c,
      rating: dbProduct.rating_c || 0,
      reviews: dbProduct.reviews_c || 0,
      stock: dbProduct.stock_c || 0,
      images: dbProduct.images_c ? dbProduct.images_c.split(',').map(img => img.trim()) : [],
      brand: dbProduct.brand_c || '',
      inStock: dbProduct.in_stock_c || false,
      material: dbProduct.material_c || '',
      colors: dbProduct.colors_c || '',
      warranty: dbProduct.warranty_c || '',
      weight: dbProduct.weight_c || '',
      dimensions: dbProduct.dimensions_c || '',
      origin: dbProduct.origin_c || ''
    };
  }
}

export const productService = new ProductService();