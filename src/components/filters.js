import AbstractSmartComponent from './abstract-component.js';

const filterTemplate = (filter) => {
  return (
    `<a href="#" data-filter-type="${filter.name}" class="main-navigation__item ${filter.active ? `main-navigation__item--active` : ``}">
        ${filter.name}
        <span class="main-navigation__item-count">${filter.count}</span>
    </a>`
  );
};

const createFilterTemplate = (filters) => {
  return filters.map((filter) => {
    return filterTemplate(filter);
  }).join(``);
};

const createFiltersTemplate = (filters) => {
  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${createFilterTemplate(filters)}
       </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

export default class Filters extends AbstractSmartComponent {
  constructor(filters) {
    super();

    this._filters = filters;
  }

  getTemplate() {
    return createFiltersTemplate(this._filters);
  }


  setFilterClickHandler(handler) {
    this.getElement().querySelector(`.main-navigation__items`).addEventListener(`click`, (evt) => {
      if (evt.target.tagName === `A`) {
        const filterType = evt.target.dataset.filterType;
        handler(filterType);
      }
    });
  }

  setStatsClickHandler(handler) {
    this.getElement().querySelector(`.main-navigation__additional`).addEventListener(`click`, handler);
  }

  reset() {
    const allElementsMenu = this.getElement().querySelectorAll(`.main-navigation__item`);
    this.getElement().querySelector(`.main-navigation__item--active`).classList
      .remove(`main-navigation__item--active`);
    allElementsMenu[0].classList.add(`main-navigation__item--active`);
  }
}
