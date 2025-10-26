import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IHeaderView {
    counter: number;
}

export class HeaderView extends Component <IHeaderView> {
    protected _cartButton: HTMLButtonElement;
    protected _counterElement: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._cartButton = ensureElement<HTMLButtonElement>('.header__basket', this.container);
        this._counterElement = ensureElement<HTMLElement>('.header__basket-counter', this.container);

        this._cartButton.addEventListener('click', () => {
            this.events.emit('shopping-cart:open');
    });
    }

    set counter(value: number) {
        this._counterElement.textContent = String(value);
    }
}

// Корзина и счетчик