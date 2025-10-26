import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

//Модель корзины покупок

export class Cart {
  protected selectedProducts: IProduct[];

  constructor(protected events: IEvents) {
    this.selectedProducts = [];
  }

  getSelectedProducts(): IProduct[] {
    return this.selectedProducts;
  }

  addProduct(product: IProduct) {
    this.selectedProducts.push(product);
    this.events.emit('shopping-cart:changed');
  }

  deleteProduct(id: string) {
    this.selectedProducts = this.selectedProducts.filter(selectedProduct => selectedProduct.id !== id);
    this.events.emit("shopping-cart:changed");
  }

  clearCart() {
    this.selectedProducts = [];
    this.events.emit("shopping-cart:changed");
  }

  getTotal(): number {
    return this.selectedProducts.reduce((total, selectedProduct) => total + (selectedProduct.price || 0), 0);
  }

  getProductsAmount(): number {
    return this.selectedProducts.length;
  }

  checkProduct(id: string): boolean {
    return this.selectedProducts.some(selectedProduct => selectedProduct.id === id);
  }
}