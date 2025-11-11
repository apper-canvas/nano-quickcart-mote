import ordersData from "@/services/mockData/orders.json";
import { format } from "date-fns";

class OrderService {
  constructor() {
    this.storageKey = "quickcart_orders";
    this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      this.orders = stored ? JSON.parse(stored) : [...ordersData];
    } catch (error) {
      console.error("Error loading orders from storage:", error);
      this.orders = [...ordersData];
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.orders));
    } catch (error) {
      console.error("Error saving orders to storage:", error);
    }
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.orders]);
      }, 250);
    });
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const order = this.orders.find(o => o.Id === parseInt(id));
        if (order) {
          resolve({ ...order });
        } else {
          reject(new Error("Order not found"));
        }
      }, 200);
    });
  }

  async create(orderData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const highestId = this.orders.length > 0 
          ? Math.max(...this.orders.map(o => o.Id)) 
          : 0;
        
        const newOrder = {
          Id: highestId + 1,
          ...orderData,
          orderDate: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
          status: "confirmed"
        };

        this.orders.push(newOrder);
        this.saveToStorage();
        resolve({ ...newOrder });
      }, 400);
    });
  }

  async generateOrderNumber() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const timestamp = Date.now();
        const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
        const orderNumber = `QC${timestamp}${randomSuffix}`;
        resolve(orderNumber);
      }, 100);
    });
  }
}

export const orderService = new OrderService();