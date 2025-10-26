import { IBuyer, TPayment } from '../../types';
import { IEvents } from '../base/Events';

//Модель для хранения и управления данными покупателя.

export class Buyer {
  protected data: IBuyer;
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
    this.data = {
      payment: "",
      address: "",
      email: "",
      phone: "",
    };
  }


  //сохранение способа оплаты, адреса доставки, почты и телефона

  savePaymentType(payment: TPayment) {
    this.data.payment = payment;
    this.events.emit('buyer-data:changed', { field: 'payment' });
  }

  saveAddress(address: string) {
    this.data.address = address;
    this.events.emit('buyer-data:changed', { field: 'address' });
  }

  saveEmail(email: string) {
    this.data.email = email;
    this.events.emit('buyer-data:changed', { field: 'email' });
  }

  savePhone(phone: string) {
    this.data.phone = phone;
    this.events.emit('buyer-data:changed', { field: 'phone' });
  }

  //

  getData(): IBuyer {
    return this.data;
  }

  clearBuyerData() {
    this.data = {
      payment: "",
      address: "",
      email: "",
      phone: "",
    };
  }

  //Проверка корректности введенных данных

  validate(): {
    payment: string;
    address: string;
    email: string;
    phone: string;
  } {
    const errors = {
      payment: "",
      address: "",
      email: "",
      phone: "",
    };

    if (!this.data.payment.trim()) {
      errors.payment = "Не выбран вид оплаты";
    }
    if (!this.data.address.trim()) {
      errors.address = "Укажите адрес";
    }

    if (!this.data.email.trim()) {
      errors.email = "Укажите email";
    }

    if (!this.data.phone.trim()) {
      errors.phone = "Укажите телефон";
    }

    return errors;
  }
}