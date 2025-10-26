import { categoryMap, CDN_URL } from "../../utils/constants";
import { IProduct } from "../../types";
import { Card } from "./Card";
import { ensureElement } from "../../utils/utils";

type CategoryKey = keyof typeof categoryMap;
export type TPreviewCard = Pick<IProduct, 'image' | 'category' | 'description'>;

export interface ICardActions {
  onClick?: (event: MouseEvent) => void;
  onButtonClick?: (event: MouseEvent) => void;
}

export class PreviewCard extends Card<TPreviewCard> {

  protected _categoryElement: HTMLElement;
  protected _imageElement: HTMLImageElement;
  protected _descriptionElement: HTMLElement;
  protected _cardButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);
    
    this._categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this._imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this._descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
    this._cardButton = ensureElement<HTMLButtonElement>('.card__button', this.container);

    if (actions?.onButtonClick) {
      this._cardButton.addEventListener('click', actions.onButtonClick);
    }
  }

  set category(value: string) {
    this._categoryElement.textContent = value;
    for (const key in categoryMap) {
      this._categoryElement.classList.toggle(
        categoryMap[key as CategoryKey],
        key == value
      );
    }
  }

  set description(value: string) {
    this._descriptionElement.textContent = value;
  }

  set cardButtonText(value: string) {
    this._cardButton.textContent = value;
  }

  set disabled(value: boolean) {
    this._cardButton.disabled = value;
    this._cardButton.classList.toggle('button_disabled', value);
  }

  set image(value: string) {
    this.setImage(this._imageElement, CDN_URL + value.slice(0, -3) + 'png', this.titleElement.textContent);
  }


  // Управление надписью и доступностью кнопки в зависимости от состояния товара:

  setCanAddToBusket(isInShoppingCart: boolean,price: number | null) {
    if (price === null) {
      this.cardButtonText = 'Недоступно';
      this.disabled = true;
    } else if (isInShoppingCart) {
      this.cardButtonText = 'Удалить из корзины';
      this.disabled = false;
    }
  }
}