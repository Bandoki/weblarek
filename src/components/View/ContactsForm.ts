import { BaseForm } from './BaseForm';
import { IBuyer } from '../../types';
import { EventEmitter } from '../base/Events';

export class ContactsForm extends BaseForm<IBuyer> {
  constructor(container: HTMLElement, events: EventEmitter) {
    super(container, events);
  }
}
