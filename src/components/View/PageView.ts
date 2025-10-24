import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';

export class PageView extends Component<unknown> {
  private _gallery: HTMLElement;
  private _cartCounter: HTMLElement;

  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);
    this._gallery = container.querySelector('.gallery')!;
    this._cartCounter = container.querySelector('.header__basket-counter')!;

    container.querySelector('.header__basket')?.addEventListener('click', () => {
      this.events.emit('cart:open');
    });
  }

  render(): HTMLElement {
    return this.container;
  }

  setCatalog(items: HTMLElement[]) {
    this._gallery.replaceChildren(...items);
  }

  updateCartCount(count: number) {
    this._cartCounter.textContent = String(count);
  }
}
