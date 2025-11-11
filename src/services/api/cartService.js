import cartItemsData from "@/services/mockData/cartItems.json";

class CartService {
  constructor() {
    this.storageKey = "quickcart_cart";
    this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      this.cartItems = stored ? JSON.parse(stored) : [...cartItemsData];
    } catch (error) {
      console.error("Error loading cart from storage:", error);
      this.cartItems = [...cartItemsData];
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
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.cartItems]);
      }, 100);
    });
  }

  async addItem(product, quantity = 1) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const existingItemIndex = this.cartItems.findIndex(
          item => item.productId === product.Id.toString()
        );

        if (existingItemIndex >= 0) {
          this.cartItems[existingItemIndex].quantity += quantity;
        } else {
          const newItem = {
            productId: product.Id.toString(),
            quantity,
            price: product.price,
            name: product.name,
            image: product.images[0]
          };
          this.cartItems.push(newItem);
        }

        this.saveToStorage();
        resolve([...this.cartItems]);
      }, 200);
    });
  }

  async updateQuantity(productId, quantity) {
    return new Promise((resolve) => {
      setTimeout(() => {
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

        resolve([...this.cartItems]);
      }, 150);
    });
  }

  async removeItem(productId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.cartItems = this.cartItems.filter(
          item => item.productId !== productId.toString()
        );
        this.saveToStorage();
        resolve([...this.cartItems]);
      }, 150);
    });
  }

  async clear() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.cartItems = [];
        this.saveToStorage();
        resolve([]);
      }, 100);
    });
  }

  async getItemCount() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const count = this.cartItems.reduce((total, item) => total + item.quantity, 0);
        resolve(count);
      }, 50);
    });
  }

  async getTotal() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const total = this.cartItems.reduce(
          (sum, item) => sum + (item.price * item.quantity), 0
        );
        resolve(total);
      }, 50);
    });
  }
}

export const cartService = new CartService();