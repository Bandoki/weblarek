import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface ICartView {
  items: HTMLElement[];
  price: number;
}

//визуальное отображение корзины на странице

export class CartView extends Component <ICartView> {
  protected _cartListElement: HTMLElement;
  protected _orderButton: HTMLButtonElement;
  protected _priceElement: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this._cartListElement = ensureElement<HTMLElement>('.basket__list', this.container);
    this._orderButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);
    this._priceElement = ensureElement<HTMLElement>('.basket__price', this.container);

    this._orderButton.addEventListener('click', () => {
      this.events.emit('order:open');
    });
  }

  set items(value: HTMLElement[]) {
    this._cartListElement.innerHTML = '';
    if (value.length === 0) {
      this._cartListElement.innerHTML = '<p class="basket__empty">Корзина пуста</p>';
    } else {
      this._cartListElement.append(...value);
    }
  }

  set price(value: number) {
    this._priceElement.textContent = `${value} синапсов`;
  }

  //управление возможностью оформить заказ

  setCanBuy(isEmpty: boolean) {
    this._orderButton.disabled = isEmpty;
    this._orderButton.classList.toggle('button_disabled', isEmpty);
  }
}
