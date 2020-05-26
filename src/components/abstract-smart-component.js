import AbstractComponent from './abstract-component.js';

export default class AbstractSmartComponent extends AbstractComponent {
  recoveryListeners() {
    throw new Error(`Данные метод нельзя испольщовать в экземпляре абстрактного компонента`);
  }

  rerender() {
    const oldElement = this.getElement();
    this.removeElement();

    const newElement = this.getElement();
    oldElement.replaceWith(newElement);

    this.recoveryListeners();
  }
}
