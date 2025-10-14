export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export type TPayment = 'card' | 'cash';

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IProductsResponse {
  total: number;
  items: IProduct[];
}

export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

export interface IOrder extends IBuyer {
  items: string[];
  total: number;
}

export interface IApi {
  get<T>(uri: string): Promise<T>;
  post<T>(uri: string, data: object): Promise<T>;
}
