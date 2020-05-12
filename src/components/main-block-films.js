import {createElement} from './../utils.js';

const createMainBlockFilmsTemplate = () => {
  return (
    `<section class="films">

     </section>`
  );
};

export default class MainBlockFilms {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createMainBlockFilmsTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
