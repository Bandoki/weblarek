import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export interface IBaseForm {
  valid: boolean;
  errors: string[];
}

//базовый класс для всех форм в приложении

export class BaseForm extends Component<IBaseForm> {
  
  protected _formElement: HTMLFormElement;
  protected _submitButton: HTMLButtonElement;
  protected _errorContainer: HTMLElement;

  constructor(container: HTMLFormElement, protected events: IEvents) {
    super(container);
    
    this._formElement = container;
    this._submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
    this._errorContainer = ensureElement<HTMLElement>('.form__errors', this.container);

    this._submitButton.disabled = true;
    this._submitButton.classList.add('button_disabled');

    this._formElement.addEventListener('submit', (event: Event) => {
      event.preventDefault();
      if (!this._submitButton.disabled) {
        this.events.emit(`${this._formElement.name}:submit`);
      }
    });
  }

  set valid(value: boolean) {
    this._submitButton.disabled = !value;
    this._submitButton.classList.toggle('button_disabled', !value);
  }

  set errors(value: string[]) {
    this._errorContainer.textContent = value.join(', ');
  }
}
