import {createElement} from './../utils.js';

const createTotalNumbersFilmsTemplate = (totalNumberFilms) => {
  return (
    `<p>${totalNumberFilms} movies inside</p>`
  );
};

export default class TotalNumbersFilms {
  constructor(totalFilms) {
    this._totalFilms = totalFilms;

    this._element = null;
  }

  getTemplate() {
    return createTotalNumbersFilmsTemplate(this._totalFilms);
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
