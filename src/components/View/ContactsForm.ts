import { BaseForm } from './BaseForm';
import { EventEmitter, IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

//форма для ввода контактных данных покупателя. Наследуется от BaseForm

export class ContactsForm extends BaseForm {

    protected _emailInput: HTMLInputElement;
    protected _phoneInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events as EventEmitter);

    this._emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
    this._phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);

    this._emailInput.addEventListener('input', () => {
      events.emit('contacts:changed', { 
        field: 'email', 
        value: this._emailInput.value 
      });
    });

    this._phoneInput.addEventListener('input', () => {
      events.emit('contacts:changed', { 
        field: 'phone', 
        value: this._phoneInput.value 
      });
    });
  }

  set email(value: string) {
    this._emailInput.value = value;
  }

  set phone(value: string) {
    this._phoneInput.value = value;
  }
}

