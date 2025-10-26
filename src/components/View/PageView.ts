import { Component } from '../base/Component';

interface IPageView {
  catalog: HTMLElement[];
}

export class PageView extends Component<IPageView> {

  constructor(container: HTMLElement) {
    super(container);
  }

  set catalog(items: HTMLElement[]) {
    this.container.innerHTML = '';
    this.container.append(...items);
  }
}
// Отображение каталога товаров на странице