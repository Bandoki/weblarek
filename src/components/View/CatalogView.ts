import { IProduct } from '../../types';
import { categoryMap, CDN_URL } from '../../utils/constants';

export class CatalogView {
  private container: HTMLElement;
  private addToCartCallback?: (product: IProduct) => void;

  private modal: HTMLElement | null;
  private modalContent: HTMLElement | null;
  private modalClose: HTMLElement | null;

  constructor(container: HTMLElement) {
    this.container = container;

    // Модальное окно
    this.modal = document.querySelector('.modal');
    this.modalContent = this.modal?.querySelector('.modal__content') ?? null;
    this.modalClose = this.modal?.querySelector('.modal__close') ?? null;

    // Кнопка закрытия модалки
    this.modalClose?.addEventListener('click', () => this.closeModal());
    this.modal?.addEventListener('click', (e) => {
      if (e.target === this.modal) this.closeModal(); // клик по фону
    });
  }

  render(items: IProduct[]) {
    this.container.innerHTML = '';

    const template = document.getElementById('card-catalog') as HTMLTemplateElement;
    if (!template) {
      console.error('Шаблон card-catalog не найден');
      return;
    }

    items.forEach((item) => {
      const card = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

      // Название
      const titleEl = card.querySelector('.card__title');
      if (titleEl) titleEl.textContent = item.title;

      // Категория
      const categoryEl = card.querySelector('.card__category');
      if (categoryEl) {
        categoryEl.textContent = item.category;
        categoryEl.className = `card__category ${categoryMap[item.category] || 'card__category_other'}`;
      }

      // Изображение
      const imageEl = card.querySelector('.card__image') as HTMLImageElement | null;
      if (imageEl) {
        imageEl.src = item.image ? `${CDN_URL}/${item.image}` : './src/images/default-image.svg';
        imageEl.alt = item.title;
      }

      // Цена
      const priceEl = card.querySelector('.card__price');
      if (priceEl) {
        priceEl.textContent = item.price ? `${item.price} синапсов` : 'Бесценно';
      }

      // При клике открываем модалку с предпросмотром 
      card.addEventListener('click', () => {
        this.openPreview(item);
      });

      this.container.appendChild(card);
    });
  }

  // Модалка предпросмотра 
  openPreview(item: IProduct): void {
    const previewTemplate = document.getElementById('card-preview') as HTMLTemplateElement;
    if (!previewTemplate || !this.modalContent) return;

    const preview = previewTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;

    const title = preview.querySelector('.card__title');
    if (title) title.textContent = item.title;

    const category = preview.querySelector('.card__category');
    if (category) {
      category.textContent = item.category;
      category.className = `card__category ${categoryMap[item.category] || 'card__category_other'}`;
    }

    const description = preview.querySelector('.card__text');
    if (description) description.textContent = item.description || '';

    const image = preview.querySelector('.card__image') as HTMLImageElement | null;
    if (image) {
      image.src = item.image ? `${CDN_URL}/${item.image}` : './src/images/default-image.svg';
      image.alt = item.title;
    }

    const price = preview.querySelector('.card__price');
    if (price) {
      price.textContent = item.price ? `${item.price} синапсов` : 'Бесценно';
    }

    // Кнопка “В корзину”
    const button = preview.querySelector('.card__button');
    if (button) {
      button.addEventListener('click', () => {
        if (this.addToCartCallback) this.addToCartCallback(item);
        this.closeModal();
      });
    }

    this.modalContent.innerHTML = '';
    this.modalContent.appendChild(preview);
    this.openModal();
  }

  // Управление модалкой 
  openModal(): void {
    if (this.modal) this.modal.classList.add('modal_active');
  }

  closeModal(): void {
    if (this.modal) this.modal.classList.remove('modal_active');
  }

  // Обработчик добавления в корзину
  setAddToCartHandler(callback: (product: IProduct) => void): void {
    this.addToCartCallback = callback;
  }
}
