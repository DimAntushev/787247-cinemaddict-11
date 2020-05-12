import {createElement} from './../utils.js';

const createSortTemplate = (sort) => {
  return (
    `<li><a href="#" class="sort__button ${sort.active ? `sort__button--active` : ``}">
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

export default class Sorts {
  constructor(sorts) {
    this._sorts = sorts;

    this._element = null;
  }

  getTemplate() {
    return createSortsTemplate(this._sorts);
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
