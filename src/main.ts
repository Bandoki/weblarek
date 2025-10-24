import './scss/styles.scss';

import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { Catalog } from './components/Models/Catalog';
import { Cart } from './components/Models/Cart';
import { Buyer } from './components/Models/Buyer';
import { LarekApi } from './components/LarekApi';
import { API_URL } from './utils/constants';
import { CatalogView } from './components/View/CatalogView';
import { CartView } from './components/View/CartView';
import { BuyerView } from './components/View/BuyerView';

// Инициализация
const events = new EventEmitter();

// Модели
const catalogModel = new Catalog(events);
const cartModel = new Cart(events);
const buyerModel = new Buyer(events);

// API
const api = new Api(API_URL);
const larekApi = new LarekApi(api);

// Представления
const galleryContainer = document.querySelector('.gallery') as HTMLElement;
const buyerContainer = document.querySelector('.buyer') as HTMLElement;

const catalogView = new CatalogView(galleryContainer);
const cartView = new CartView(events);
const buyerView = new BuyerView(buyerContainer, buyerModel, events);

// Источник данных корзины
cartView.setGetItemsHandler(() => cartModel.items);

// Обработчики
catalogView.setAddToCartHandler((product) => {
  cartModel.addProduct(product);
  updateBasketCounter();
});

cartView.setRemoveItemHandler((id) => {
  cartModel.removeProduct(id);
  updateBasketCounter();
});

cartView.setCheckoutHandler(() => {
  buyerView.openOrderForm(cartModel.items, cartModel.getTotal());
});

function updateBasketCounter() {
  const counter = document.querySelector('.header__basket-counter');
  if (counter) counter.textContent = String(cartModel.items.length);
}


// Получаем товары 
larekApi
  .getProducts()
  .then((items) => {
    catalogModel.items = items;
    catalogView.render(items);
  })
  .catch((err) => console.error('Ошибка при получении товаров:', err));

  // После успешного оформления заказа очищаем корзину
events.on('order:complete', () => {
  cartModel.clear();
  updateBasketCounter();
});