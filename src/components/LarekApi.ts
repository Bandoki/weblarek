import { IApi, IProduct, IOrder, IProductsResponse } from '../types';

export class LarekApi {
  constructor(protected api: IApi) {}

  getProducts(): Promise<IProduct[]> {
    return this.api.get<IProductsResponse>('/api/weblarek/product/').then(response => {
      return response.items;
    });
  }

  sendOrder(order: IOrder) {
    return this.api.post('/api/weblarek/order/', order);
  }
}