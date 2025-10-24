import { Component } from '../base/Component';

export class OrderSuccessCard extends Component<{ total: number }> {
  private _total: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this._total = container.querySelector('.order-success__total')!;
  }

  render(data: { total: number }): HTMLElement {
    this._total.textContent = `${data.total} синапсов`;
    return this.container;
  }
}
