import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface IOrderSuccessView {
    total: number;
}

interface IOrderSuccessAction {
    onClick: () => void;
}

//Показ окна "Заказ успешно офрмлен"

export class OrderSuccessView extends Component <IOrderSuccessView> {
    protected _closeButton: HTMLButtonElement;
    protected _description: HTMLElement;
    
    constructor(container: HTMLElement, actions: IOrderSuccessAction) {
        super(container);

        this._closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);
        this._description = ensureElement<HTMLElement>('.order-success__description', this.container);

        if (actions?.onClick) {
            this._closeButton.addEventListener('click', actions.onClick);
        }
    }

    set total(value: number) {
        this._description.textContent = `Списано ${value} синапсов`;
    }
}