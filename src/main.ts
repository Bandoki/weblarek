import './scss/styles.scss';

import { Api } from './components/base/Api';
import { Catalog } from './components/Models/Catalog';
import { Cart } from './components/Models/Cart';
import { Buyer } from './components/Models/Buyer';
import { LarekApi } from './components/LarekApi';
import { API_URL } from './utils/constants';

// Создаём экземпляры моделей
const catalogModel = new Catalog();
const cartModel = new Cart();
const buyerModel = new Buyer();

// Создаём экземпляр API
const api = new Api(API_URL);
const larekApi = new LarekApi(api);

// Получаем товары с сервера и сохраняем их в модель
larekApi.getProducts()
  .then((items) => {
    catalogModel.setItems(items);
    console.log('Полученные товары:', catalogModel.getItems());
  })
  .catch((err) => {
    console.error('Ошибка при получении товаров:', err);
  });

// Тестовые данные покупателя и корзины 
buyerModel.setField('email', 'test@example.com');
buyerModel.setField('phone', '1234567890');
buyerModel.setField('address', 'Москва');
buyerModel.setField('payment', 'card');

cartModel.addItem({ 
  id: 'test-id',
  description: 'Тестовый товар',
  image: '',
  title: 'Тест',
  category: 'test',
  price: 100,
});

console.log('Данные покупателя:', buyerModel.getData());
console.log('Товары в корзине:', cartModel.getItems());
console.log('Ошибки валидации:', buyerModel.validate());
