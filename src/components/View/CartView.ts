import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class CartView {
  private modal: HTMLElement | null;
  private modalContent: HTMLElement | null;
  private removeItemCallback?: (id: string) => void;
  private checkoutCallback?: () => void;
  private getItems?: () => IProduct[];

  constructor(private events: IEvents) {
    this.modal = document.querySelector('.modal');
    this.modalContent = this.modal?.querySelector('.modal__content') ?? null;

    // Закрытие модалки 
    const closeBtn = this.modal?.querySelector('.modal__close');
    closeBtn?.addEventListener('click', () => this.closeModal());
    this.modal?.addEventListener('click', (e) => {
      if (e.target === this.modal) this.closeModal();
    });

    // Открытие корзины по клику на иконку 
    const openCartBtn = document.querySelector('.header__basket');
    openCartBtn?.addEventListener('click', () => {
      if (this.getItems) {
        this.openCart(this.getItems());
      }
    });

    // Подписываемся на события модели
    this.events.on('cart:change', () => {
      if (this.getItems) {
        this.render(this.getItems());
      }
    });
  }

  // Устанавливаем источник данных корзины (CartModel.items) 
  setGetItemsHandler(callback: () => IProduct[]): void {
    this.getItems = callback;
  }

  // Перерисовка корзины 
  render(items: IProduct[]): void {
    // Если модалка открыта — обновляем её содержимое
    if (this.modal?.classList.contains('modal_active')) {
      this.openCart(items);
    }
  }

  // Открытие корзины 
  private openCart(items: IProduct[]): void {
    if (!this.modalContent) return;

    const basketTemplate = document.getElementById('basket') as HTMLTemplateElement;
    if (!basketTemplate) {
      console.error('Шаблон корзины не найден');
      return;
    }

    const basket = basketTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
    const listEl = basket.querySelector('.basket__list') as HTMLElement;
    const totalEl = basket.querySelector('.basket__price') as HTMLElement;
    const checkoutBtn = basket.querySelector('.basket__button') as HTMLElement;

    if (items.length === 0) {
      listEl.innerHTML = '<li class="basket__empty">Корзина пуста</li>';
      totalEl.textContent = '0 синапсов';
    } else {
      listEl.innerHTML = '';
      let total = 0;

      items.forEach((item, index) => {
        total += item.price ?? 0;

        const li = document.createElement('li');
        li.className = 'basket__item card card_compact';
        li.setAttribute('data-id', item.id);

        li.innerHTML = `
          <span class="basket__item-index">${index + 1}</span>
          <span class="card__title">${item.title}</span>
          <span class="card__price">${item.price ?? '—'} синапсов</span>
          <button class="basket__item-delete card__button" aria-label="удалить"></button>
        `;

        li.querySelector('.basket__item-delete')?.addEventListener('click', () => {
          if (this.removeItemCallback) this.removeItemCallback(item.id);
        });

        listEl.appendChild(li);
      });

      totalEl.textContent = `${total} синапсов`;
    }

    checkoutBtn.addEventListener('click', () => {
      if (this.checkoutCallback) this.checkoutCallback();
    });

    this.modalContent.innerHTML = '';
    this.modalContent.appendChild(basket);
    this.openModal();
  }

  // Управление модалкой 
  private openModal(): void {
    this.modal?.classList.add('modal_active');
  }

  private closeModal(): void {
    this.modal?.classList.remove('modal_active');
  }

  // Коллбеки 
  setRemoveItemHandler(callback: (id: string) => void): void {
    this.removeItemCallback = callback;
  }

  setCheckoutHandler(callback: () => void): void {
    this.checkoutCallback = callback;
  }
}
