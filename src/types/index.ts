export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';
export type TPayment = "card" | "cash" | "";
export type TProductCategory = 'софт-скил' | 'хард-скил' | 'другое' | 'кнопка' | 'дополнительное';
export type TProductPrice = number | null;
export type TOrderResponse = {
  id: string;
  total: number;
};

export const categoryType: Record<TProductCategory, string> = {
  'софт-скил': 'card__category_soft',
  'хард-скил': 'card__category_hard',
  'кнопка': 'card__category_button',
  'дополнительное': 'card__category_additional',
  'другое': 'card__category_other',
};


export interface IProduct {
  id: string;
  productIndex: number;
  description: string;
  image: string;
  title: string;
  category: TProductCategory;
  price: TProductPrice;
}

export interface IProductPreview extends IProduct {
  inBasket: boolean;
  canAddToBasket: boolean;
}

export interface IGalery {
  items: IProduct[];
  getProduct(productId:string) : IProduct;
  getProductPrice(productId:string) : TProductPrice;
}

export interface IOrderValidation {
  valid: boolean;
  message: string;
}

export interface IBasket {
  items: IProduct[];
  addProduct(item: IProduct): void;
  alreadyInBasket(productId: string): boolean;
  clear(): void;
  getTotal(): number;
  getCount(): number;
  removeProduct(productId: string): void;
}

export interface IOrderData {
  address: string;
  email: string;
  payment: TPayment;
  phone: string;
}

export interface IProductsResponse {
  total: number;
  items: IProduct[];
}

export interface IOrderResponse {//
  id?: string;
  total?: number;
  error?: string;
  code?: number;
}

export interface IOrderResultApi {
  items: IProduct[];
  total: number;
}


export interface IBuyer {
  payment: TPayment;
  address: string;
  email: string;
  phone: string;
}

export interface IOrderRequest extends IBuyer {
  total: number;
  items: string[];
};

export interface IValidateData {
  valid: boolean;
  errors: string;
}

export interface IContactsViewData extends IValidateData {
  email: string;
  phone: string;
}

export interface IOrderViewData  extends IValidateData  {
  address: string;
  payment: TPayment;
}

export interface IOrder extends IBuyer {
  clear(): void;
  getIBuyer(): IBuyer;
}

export interface IOrderRequest extends IBuyer {
  total: number;
  items: string[];
};

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods
  ): Promise<T>;
}
