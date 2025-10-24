import { IBasket, IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class Cart implements IBasket {
  protected _items: IProduct[] = [];
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  get items(): IProduct[] {
    return this._items;
  }

  addProduct(item: IProduct): void {
    this._items.push(item);
    this.events.emit('cart:change');
  }

  removeProduct(productId: string): void {
    if (!this.alreadyInBasket(productId)) {
      console.warn("Нельзя удалить то, чего нет в корзине!");
      return;
    }
    this._items = this._items.filter(item => item.id !== productId);
    this.events.emit('cart:change');
  }

  alreadyInBasket(productId: string): boolean {
    return this._items.some(item => item.id === productId);
  }

  clear(): void {
    this._items = [];
    this.events.emit('cart:change');
  }

  getTotal(): number {
    return this._items.reduce((sum, item) => sum + (item.price ?? 0), 0);
  }

  getCount(): number {
    return this._items.length;
  }
}
