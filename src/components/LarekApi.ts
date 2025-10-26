import { Api } from "./base/Api";
import { IApi, IOrderRequest, TOrderResponse, IOrderResultApi } from '../types/index';

export class LarekApi {
  protected api: IApi;

  constructor(api: Api) {
    this.api = api;
  }

  // Метод для получения списка товаров с сервера.

  async getProducts(): Promise<IOrderResultApi> {
    return this.api.get('/product/');
  }

  // Метод для отправки заказа на сервер.

  async postOrder(orderRequest: IOrderRequest): Promise<TOrderResponse> {
    return this.api.post('/order/', orderRequest);
  }
}