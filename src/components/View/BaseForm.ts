import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';

export abstract class BaseForm<T> extends Component<T> {
  protected _form: HTMLFormElement;
  protected _submitButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);
    this._form = container.querySelector('form')!;
    this._submitButton = this._form.querySelector('button[type="submit"]')!;

    this._form.addEventListener('input', (e) => {
      const input = e.target as HTMLInputElement;
      this.events.emit('form:change', { field: input.name, value: input.value });
    });

    this._form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.events.emit('form:submit', {});
    });
  }

  toggleSubmit(state: boolean) {
    this._submitButton.disabled = !state;
  }
}
