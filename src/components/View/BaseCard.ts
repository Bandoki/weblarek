import { Component } from '../base/Component';
import { IProduct } from '../../types';
import { categoryMap, CDN_URL } from '../../utils/constants';

export abstract class BaseCard<T extends IProduct> extends Component<T> {
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _category: HTMLElement;
  protected _image: HTMLImageElement;
  protected _description?: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this._title = container.querySelector('.card__title')!;
    this._price = container.querySelector('.card__price')!;
    this._category = container.querySelector('.card__category')!;
    this._image = container.querySelector('.card__image')!;
    this._description = container.querySelector('.card__description')!;
  }

  protected setTitle(value: string) {
    this._title.textContent = value;
  }

  protected setPrice(value: number | null) {
    this._price.textContent = value ? `${value} синапсов` : 'Бесценно';
  }

  protected setCategory(value: string) {
    this._category.textContent = value;
    const key = value as keyof typeof categoryMap;
    this._category.className = `card__category ${categoryMap[key] || ''}`;
  }

  protected updateImage(image: string, title: string) {
    this._image.src = `${CDN_URL}/${image}`;
    this._image.alt = title;
  }

  protected setDescription(value: string) {
    if (this._description) this._description.textContent = value;
  }
}
