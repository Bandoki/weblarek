import { IProduct, IGalery, TProductPrice } from '../../types';
import { IEvents } from '../base/Events';

export class Catalog implements IGalery {
  protected _items: IProduct[] = [];
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  set items(items: IProduct[]) {
    this._items = items;
    this.events.emit('catalog:changed');
  }

  get items(): IProduct[] {
    return this._items;
  }

  getProduct(productId: string): IProduct {
    const product = this._items.find(item => item.id === productId);
    if (!product) {
      throw new Error(`Товар с id "${productId}" не найден`);
    }
    return product;
  }

  getProductPrice(productId: string): TProductPrice {
    const product = this._items.find(item => item.id === productId);
    return product ? product.price : null;
  }
}
