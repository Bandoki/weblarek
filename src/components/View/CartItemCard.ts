import { Component } from '../base/Component';
import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';


// Класс карточки товара внутри корзины

export class CartItemCard extends Component<IProduct> {
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _button: HTMLButtonElement;
  protected events: EventEmitter;

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container);
    this.events = events;

    this._title = container.querySelector('.basket__title')!;
    this._price = container.querySelector('.basket__price')!;
    this._button = container.querySelector('.basket__button')!;

    // Удаление товара из корзины
    this._button.addEventListener('click', () => {
      this.events.emit('cart:remove', { id: this.container.dataset.id });
    });
  }

  render(data: IProduct): HTMLElement {
    this.container.dataset.id = data.id;
    this._title.textContent = data.title;
    this._price.textContent = data.price ? `${data.price} синапсов` : 'Бесценно';
    return this.container;
  }
}
