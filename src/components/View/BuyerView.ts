import { IProduct } from '../../types';

export class BuyerView {
  private modal: HTMLElement | null;
  private modalContent: HTMLElement | null;

  constructor(
    private container: HTMLElement,
    private buyerModel: any,
    private events: any
  ) {
    this.modal = document.querySelector('.modal');
    this.modalContent = this.modal?.querySelector('.modal__content') ?? null;
  }

  
  // Простая валидация
 
  private isValidAddress(value: string): boolean {
    return value.trim().length > 0;
  }

  private isValidEmail(value: string): boolean {
    // проверка email 
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  private isValidPhone(value: string): boolean {
    // разрешаем цифры, пробелы, скобки, +, -, минимум 5 символов
    return /^[+\d\s()-]{5,}$/.test(value.trim());
  }

 
  // Шаг 1: адрес и способ оплаты
  
  openOrderForm(items: IProduct[], total: number): void {
    if (!this.modalContent) return;

    const orderTemplate = document.getElementById('order') as HTMLTemplateElement;
    if (!orderTemplate) {
      console.error('Шаблон order не найден');
      return;
    }

    const orderForm = orderTemplate.content.firstElementChild!.cloneNode(true) as HTMLFormElement;

    const nextBtn = orderForm.querySelector('.order__button') as HTMLButtonElement;
    const addressInput = orderForm.querySelector('[name="address"]') as HTMLInputElement;
    const errorsSpan = orderForm.querySelector('.form__errors') as HTMLElement;

    // начальное состояние
    nextBtn.disabled = true;

    let selectedPayment = '';

    const updateNextButton = () => {
      const addressValid = this.isValidAddress(addressInput.value);
      const paymentValid = Boolean(selectedPayment);
      const ok = addressValid && paymentValid;
      nextBtn.disabled = !ok;

      if (!addressValid && !paymentValid) {
        errorsSpan.textContent = 'Введите адрес и выберите способ оплаты';
      } else if (!addressValid) {
        errorsSpan.textContent = 'Введите адрес';
      } else if (!paymentValid) {
        errorsSpan.textContent = 'Выберите способ оплаты';
      } else {
        errorsSpan.textContent = '';
      }
    };

    // Кнопки оплаты 
    const paymentButtons = orderForm.querySelectorAll('.order__buttons .button');
    paymentButtons.forEach((btn) => {
      btn.addEventListener('click', (ev) => {
        ev.preventDefault();
        paymentButtons.forEach((b) => b.classList.remove('button_alt-active'));
        btn.classList.add('button_alt-active');
        selectedPayment = String(btn.getAttribute('name') ?? '');
        // сохраняем в модель
        try { this.buyerModel.setFieldData('payment', selectedPayment); } catch (err) {}
        updateNextButton();
      });
    });

    // Ввод адреса
    addressInput.addEventListener('input', () => {
      const v = addressInput.value;
      try { this.buyerModel.setFieldData('address', v); } catch (err) {}
      updateNextButton();
    });

    // сабмит шага 1
    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // защита на случай — ещё раз проверяем
      if (!this.isValidAddress(addressInput.value) || !selectedPayment) {
        updateNextButton();
        return;
      }
      this.openContactsForm(items, total);
    });

    // рендерим
    this.modalContent.innerHTML = '';
    this.modalContent.appendChild(orderForm);
    this.openModal();
    updateNextButton();
  }

  
  // Шаг 2: email и телефон (контакты)
  
  openContactsForm(items: IProduct[], total: number): void {
    if (!this.modalContent) return;

    const contactsTemplate = document.getElementById('contacts') as HTMLTemplateElement;
    if (!contactsTemplate) {
      console.error('Шаблон contacts не найден');
      return;
    }

    const form = contactsTemplate.content.firstElementChild!.cloneNode(true) as HTMLFormElement;
    const emailInput = form.querySelector('[name="email"]') as HTMLInputElement;
    const phoneInput = form.querySelector('[name="phone"]') as HTMLInputElement;
    const payButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
    const errors = form.querySelector('.form__errors') as HTMLElement;

    // начальное состояние
    payButton.disabled = true;

    const updatePayButton = () => {
      const emailValid = this.isValidEmail(emailInput.value);
      const phoneValid = this.isValidPhone(phoneInput.value);
      const ok = emailValid && phoneValid;
      payButton.disabled = !ok;

      if (!emailValid && !phoneValid) {
        errors.textContent = 'Введите корректные email и телефон';
      } else if (!emailValid) {
        errors.textContent = 'Некорректный email';
      } else if (!phoneValid) {
        errors.textContent = 'Некорректный телефон';
      } else {
        errors.textContent = '';
      }
    };

    emailInput.addEventListener('input', () => {
      try { this.buyerModel.setFieldData('email', emailInput.value); } catch (err) {}
      updatePayButton();
    });

    phoneInput.addEventListener('input', () => {
      try { this.buyerModel.setFieldData('phone', phoneInput.value); } catch (err) {}
      updatePayButton();
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // финальная защита
      if (!this.isValidEmail(emailInput.value) || !this.isValidPhone(phoneInput.value)) {
        updatePayButton();
        return;
      }

      // показываем окно успеха (без немедленной очистки корзины)
      this.showSuccess(total);
    });

    this.modalContent.innerHTML = '';
    this.modalContent.appendChild(form);
    this.openModal();
    updatePayButton();
  }

  // Успех — очистка по кнопке
  
  showSuccess(total: number): void {
    if (!this.modalContent) return;

    const successTemplate = document.getElementById('success') as HTMLTemplateElement;
    if (!successTemplate) {
      console.error('Шаблон success не найден');
      return;
    }

    const success = successTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;

    const sumEl = success.querySelector('.order-success__description');
    if (sumEl) sumEl.textContent = `Списано ${total} синапсов`;

    const closeBtn = success.querySelector('.order-success__close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        // очищаем корзину в фоне (Presenter должен слушать событие)
        try { this.events.emit('order:complete'); } catch (err) {}
        this.closeModal();
      });
    }

    this.modalContent.innerHTML = '';
    this.modalContent.appendChild(success);
  }

  
  // Модалка
  
  private openModal(): void {
    this.modal?.classList.add('modal_active');
  }

  private closeModal(): void {
    this.modal?.classList.remove('modal_active');
  }
}
