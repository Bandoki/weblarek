import { IBuyer, TPayment, IOrderValidation } from '../../types';
import { IEvents } from '../base/Events';

export class Buyer implements IBuyer {
  protected _address = '';
  protected _email = '';
  protected _payment: TPayment = null;
  protected _phone = '';
  protected events: IEvents;
       
  constructor(events: IEvents) {
    this.events = events;
  }

  clear() {
    this._address = '';
    this._email = '';
    this._payment = null;
    this._phone = '';
  }

  // Сеттеры 
  set address(value: string) { this._address = value; }
  set phone(value: string) { this._phone = value; }
  set email(value: string) { this._email = value; }
  set payment(value: TPayment) { this._payment = value; }

  // Геттеры 
  get address(): string { return this._address; }
  get phone(): string { return this._phone; }
  get email(): string { return this._email; }
  get payment(): TPayment { return this._payment; }

  // Валидация 
  validateAdress(): IOrderValidation {
    let valid = true;
    let message = '';

    if (!this._address) {
      valid = false;
      message = 'Введите адрес доставки.';
    }

    return { valid, message };
  }

  validatePayment(): IOrderValidation {
    let valid = true;
    let message = '';

    if (!this._payment) {
      valid = false;
      message = 'Выберите способ оплаты.';
    }

    return { valid, message };
  }

  validateMail(): IOrderValidation {
    let valid = true;
    let message = '';

    if (!this._email) {
      valid = false;
      message = 'Введите Email.';
    }

    return { valid, message };
  }

  validatePhone(): IOrderValidation {
    let valid = true;
    let message = '';

    if (!this._phone) {
      valid = false;
      message = 'Введите номер телефона.';
    }

    return { valid, message };
  }

  // Обновление данных 
  setFieldData<T extends keyof IBuyer>(field: T, value: IBuyer[T]) {
    switch (field) {
      case 'address':
        this.address = value as string;
        this.events.emit('buyer:address-change');
        break;
      case 'email':
        this.email = value as string;
        this.events.emit('buyer:email-change');
        break;
      case 'payment':
        this.payment = value as TPayment;
        this.events.emit('buyer:payment-change');
        break;
      case 'phone':
        this.phone = value as string;
        this.events.emit('buyer:phone-change');
        break;
      default:
        console.warn(`setFieldData: Unknown field: ${field}`);
    }
  }

  // Получение данных
  getOrderData() {
    return {
      address: this._address,
      email: this._email,
      payment: this._payment,
      phone: this._phone,
    };
  }

  getIBuyer(): IBuyer {
    return {
      address: this._address,
      email: this._email,
      payment: this._payment,
      phone: this._phone,
    };
  }
}
