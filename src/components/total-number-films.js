import AbstractComponent from './abstract-component.js';

const createTotalNumbersFilmsTemplate = (totalNumberFilms) => {
  return (
    `<p>${totalNumberFilms} movies inside</p>`
  );
};

export default class TotalNumbersFilms extends AbstractComponent {
  constructor(totalFilms) {
    super();

    this._totalFilms = totalFilms;
  }

  getTemplate() {
    return createTotalNumbersFilmsTemplate(this._totalFilms);
  }
}
