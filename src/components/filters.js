import AbstractComponent from './abstract-component.js';

const filterTemplate = (filter) => {
  return (
    `<a href="#watchlist" class="main-navigation__item">
        ${filter[0]}
        <span class="main-navigation__item-count">${filter[1]}</span>
    </a>`
  );
};

const createFilterTemplate = (filters) => {
  const filtersNew = Object.entries(filters);

  return filtersNew.map((filter) => {
    return filterTemplate(filter);
  }).join(``);
};

const createFiltersTemplate = (filters) => {
  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
        ${createFilterTemplate(filters)}
       </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

export default class Filters extends AbstractComponent {
  constructor(filters) {
    super();

    this._filters = filters;
  }

  getTemplate() {
    return createFiltersTemplate(this._filters);
  }
}
