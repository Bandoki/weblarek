import { BaseForm } from './BaseForm';
import { IBuyer } from '../../types';
import { EventEmitter } from '../base/Events';

export class OrderForm extends BaseForm<IBuyer> {
  private _paymentButtons: NodeListOf<HTMLButtonElement>;

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container, events);
    this._paymentButtons = container.querySelectorAll('.button_alt');

    this._paymentButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        this._paymentButtons.forEach(b => b.classList.remove('button_alt-active'));
        btn.classList.add('button_alt-active');
        this.events.emit('payment:select', { method: btn.name });
      });
    });
  }
}
