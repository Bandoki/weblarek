import { IApi, IProduct, IOrder, IProductsResponse } from '../types';

export class LarekApi {
  constructor(protected api: IApi) {}

  getProducts(): Promise<IProduct[]> {
    return this.api.get<IProductsResponse>('/product/').then(response => response.items);
  }

  sendOrder(order: IOrder) {
    return this.api.post('/order/', order);
  }
}