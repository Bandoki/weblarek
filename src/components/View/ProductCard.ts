import { IProduct } from '../../types';
import { ModalView } from './ModalView';
import { categoryMap, CDN_URL } from '../../utils/constants';

export class ProductCard {
  private modal: ModalView;
  private addToCartCallback?: (product: IProduct) => void;

  constructor() {
    this.modal = new ModalView();
  }

  open(product: IProduct): void {
    const template = document.querySelector('#card-preview') as HTMLTemplateElement;
    const card = template.content.cloneNode(true) as HTMLElement;

    const image = card.querySelector('.card__image') as HTMLImageElement;
    const title = card.querySelector('.card__title') as HTMLElement;
    const description = card.querySelector('.card__text') as HTMLElement;
    const category = card.querySelector('.card__category') as HTMLElement;
    const price = card.querySelector('.card__price') as HTMLElement;
    const button = card.querySelector('.card__button') as HTMLElement;

    image.src = `${CDN_URL}/${product.image}`;
    title.textContent = product.title;
    description.textContent = product.description;
    category.textContent = product.category;
    category.className = `card__category ${categoryMap[product.category] || 'card__category_other'}`;
    price.textContent = product.price ? `${product.price} синапсов` : 'Бесценно';

    button.textContent = product.price ? 'В корзину' : 'Бесплатно';
    button.addEventListener('click', () => {
      if (this.addToCartCallback) this.addToCartCallback(product);
      this.modal.close();
    });

    this.modal.open(card);
  }

  setAddToCartHandler(callback: (product: IProduct) => void) {
    this.addToCartCallback = callback;
  }
}
