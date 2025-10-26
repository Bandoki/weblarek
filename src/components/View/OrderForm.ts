import { BaseForm } from './BaseForm';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

//Форма оформления заказа

export class OrderForm extends BaseForm {
  protected _paymentButtons: HTMLButtonElement[];
  protected _addressElement: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this._paymentButtons = Array.from(this.container.querySelectorAll('button[name]'));
    this._addressElement = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
    
    this._paymentButtons.forEach(button => {
      button.addEventListener('click', () => {
        events.emit('order:changed', { 
          field: 'payment', 
          value: button.getAttribute('name') || '' 
        });
      });
    });
    
    this._addressElement.addEventListener('input', () => {
      events.emit('order:changed', { 
        field: 'address', 
        value: this._addressElement.value 
      });
    });
  }

  set payment(value: string) {
    this._paymentButtons.forEach(btn => {
      btn.classList.toggle('button_alt-active', btn.getAttribute('name') === value);
    });
  }

  set address(value: string) {
    this._addressElement.value = value;
  }
}