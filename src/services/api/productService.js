import productsData from "@/services/mockData/products.json";

class ProductService {
  constructor() {
    this.products = [...productsData];
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.products]);
      }, 300);
    });
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const product = this.products.find(p => p.Id === parseInt(id));
        if (product) {
          resolve({ ...product });
        } else {
          reject(new Error("Product not found"));
        }
      }, 200);
    });
  }

  async getByCategory(category) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = this.products.filter(p => 
          p.category.toLowerCase() === category.toLowerCase()
        );
        resolve([...filtered]);
      }, 250);
    });
  }
async searchProducts(query) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = this.products.filter(p =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
        );
        resolve([...filtered]);
      }, 300);
    });
  }

  async getRelated(productId, category, limit = 4) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const related = this.products
          .filter(p => p.Id !== productId && p.category === category)
          .sort((a, b) => b.rating - a.rating || b.reviews - a.reviews)
          .slice(0, limit);
        resolve([...related]);
      }, 400);
    });
  }

  async getCategories() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const categories = [...new Set(this.products.map(p => p.category))];
        resolve(categories);
      }, 150);
    });
  }

  async getFeatured() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const featured = this.products
          .filter(p => p.rating >= 4.7)
          .sort((a, b) => b.reviews - a.reviews)
          .slice(0, 6);
        resolve([...featured]);
      }, 250);
    });
  }
}

export const productService = new ProductService();