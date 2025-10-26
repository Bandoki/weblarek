import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { Card } from './Card';


// Класс карточки товара внутри корзины

export type TCardCart = {
  index?: number;
  id?: string;
};

export class CartCard extends Card<TCardCart> {
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;
  protected _id?: string;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    
    this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

    this.deleteButton.addEventListener('click', () => { 
      if (this._id) {
        this.events.emit('shopping-cart:remove', { id: this._id }); 
      } 
    }); 
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }

  set id(value: string) {
    this._id = value;
  }
}