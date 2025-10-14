import { IBuyer, TPayment } from '../../types';

export class Buyer {
  protected data: Partial<IBuyer> = {};

  setField(field: keyof IBuyer, value: string): void {
    this.data[field] = value as TPayment;
  }

  getData(): Partial<IBuyer> {
    return this.data;
  }

  clear(): void {
    this.data = {};
  }

  validate(): { [K in keyof IBuyer]?: string } {
    const errors: { [K in keyof IBuyer]?: string } = {};

    if (!this.data.payment) errors.payment = 'Не выбран вид оплаты';
    if (!this.data.email) errors.email = 'Укажите email';
    if (!this.data.phone) errors.phone = 'Укажите телефон';
    if (!this.data.address) errors.address = 'Укажите адрес';

    return errors;
  }
}
