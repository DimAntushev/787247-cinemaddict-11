import AbstractComponent from './abstract-component.js';

const createSortTemplate = (sort) => {
  return (
    `<li><a href="#" class="sort__button ${sort.active ? `sort__button--active` : ``}" data-sort-name=${sort.name}>
      Sort by ${sort.name}
    </a></li>`
  );
};

const createSortsListTemplate = (sorts) => {
  return sorts.map((sort) => {
    return createSortTemplate(sort);
  }).join(``);
};

const createSortsTemplate = (sorts) => {
  return (
    `<ul class="sort">
      ${createSortsListTemplate(sorts)}
    </ul>`
  );
};

export default class Sorts extends AbstractComponent {
  constructor(sorts) {
    super();

    this._sorts = sorts;
  }

  getTemplate() {
    return createSortsTemplate(this._sorts);
  }

  reset() {
    const allButtonsElements = this.getElement().querySelectorAll(`.sort__button`);
    allButtonsElements.forEach((buttonElement) => buttonElement.classList.remove(`sort__button--active`));
    allButtonsElements[0].classList.add(`sort__button--active`);
  }

  removeActiveButton() {
    this.getElement()
      .querySelector(`.sort__button--active`)
      .classList
      .remove(`sort__button--active`);
  }

  setSortButtonClickHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (!evt.target.classList.contains(`sort__button--active`)) {
        this.removeActiveButton();
        evt.target.classList.add(`sort__button--active`);
        handler(evt);
      }
    });
  }
}
