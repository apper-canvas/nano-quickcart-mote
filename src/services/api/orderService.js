import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';
import { format } from "date-fns";

class OrderService {
  constructor() {
    this.tableName = 'orders_c';
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
          {"field": {"Name": "Name"}},
          {"field": {"Name": "order_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "total_amount_c"}},
          {"field": {"Name": "items_c"}}
        ],
        orderBy: [{"fieldName": "order_date_c", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error("Error fetching orders:", response.message);
        toast.error(response.message);
        return [];
      }

      return response.data.map(this.transformOrder);
    } catch (error) {
      console.error("Error fetching orders:", error?.response?.data?.message || error.message);
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
          {"field": {"Name": "Name"}},
          {"field": {"Name": "order_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "total_amount_c"}},
          {"field": {"Name": "items_c"}}
        ]
      });

      if (!response.success) {
        console.error("Error fetching order:", response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error("Order not found");
      }

      return this.transformOrder(response.data);
    } catch (error) {
      console.error(`Error fetching order ${id}:`, error?.response?.data?.message || error.message);
      throw error;
    }
  }

  async create(orderData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      // Generate order number for Name field
      const orderNumber = await this.generateOrderNumber();

      const orderPayload = {
        records: [{
          Name: orderNumber,
          order_date_c: new Date().toISOString(),
          status_c: "confirmed",
          total_amount_c: orderData.totalAmount || orderData.total_amount_c,
          items_c: JSON.stringify(orderData.items || [])
        }]
      };

      const response = await apperClient.createRecord(this.tableName, orderPayload);

      if (!response.success) {
        console.error("Error creating order:", response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create order:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to create order");
        }

        if (successful.length > 0) {
          const createdOrder = this.transformOrder(successful[0].data);
          toast.success("Order created successfully!");
          return createdOrder;
        }
      }

      throw new Error("Unexpected response format");
    } catch (error) {
      console.error("Error creating order:", error?.response?.data?.message || error.message);
      throw error;
    }
  }

  async generateOrderNumber() {
    const timestamp = Date.now();
    const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
    return `QC${timestamp}${randomSuffix}`;
  }

  // Transform database order to expected format
  transformOrder(dbOrder) {
    let items = [];
    try {
      items = dbOrder.items_c ? JSON.parse(dbOrder.items_c) : [];
    } catch (error) {
      console.error("Error parsing order items:", error);
      items = [];
    }

    return {
      Id: dbOrder.Id,
      id: dbOrder.Name || `ORDER_${dbOrder.Id}`, // Use Name field as order number
      orderDate: dbOrder.order_date_c,
      status: dbOrder.status_c || 'confirmed',
      totalAmount: dbOrder.total_amount_c || 0,
      items: items
    };
  }
}

export const orderService = new OrderService();