export class ModalView {
  private modal: HTMLElement;
  private modalContent: HTMLElement;
  private closeButton: HTMLElement;

  constructor() {
    this.modal = document.querySelector('.modal') as HTMLElement;
    this.modalContent = this.modal.querySelector('.modal__content') as HTMLElement;
    this.closeButton = this.modal.querySelector('.modal__close') as HTMLElement;

    // закрытие по кнопке
    this.closeButton.addEventListener('click', () => this.close());

    // закрытие по клику вне контейнера
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });
  }

  open(content: HTMLElement) {
    this.modalContent.innerHTML = '';
    this.modalContent.appendChild(content);
    this.modal.classList.add('modal_active');
  }

  close() {
    this.modal.classList.remove('modal_active');
    this.modalContent.innerHTML = '';
  }
}
