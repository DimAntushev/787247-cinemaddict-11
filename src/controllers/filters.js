import {FilterType} from './../const.js';
import {render, replace} from './../utils/render.js';
import {getFilmsByFilter} from './../utils/filters.js';
import FiltersComponent from './../components/filters.js';
import {pageController, statsController} from './../main.js';

export default class Filters {
  constructor(container, filmsModel) {
    this._container = container;
    this._filmsModel = filmsModel;
    this._filters = null;

    this._onFilterChange = this._onFilterChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);

    this._filmsModel.setDataChangeHandler(this._onDataChange);

    this._filtersComponent = null;
  }

  render() {
    const oldFiltersComponent = this._filtersComponent;

    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        count: getFilmsByFilter(this._filmsModel.getFilmsAll(), filterType).length,
        active: this._filmsModel.getFilter() === filterType
      };
    });

    this._filtersComponent = new FiltersComponent(filters);

    this._filtersComponent.setFilterClickHandler((filterType) => {
      pageController.show();
      statsController.hide();
      this._onFilterChange(filterType);
    });

    this._filtersComponent.setStatsClickHandler(() => {
      statsController.show();
      pageController.hide();
      this._filtersComponent.reset();
    });

    if (oldFiltersComponent) {
      replace(this._filtersComponent, oldFiltersComponent);
    } else {
      render(this._container, this._filtersComponent);
    }
  }

  _onFilterChange(filterType) {
    this._filmsModel.setFilter(filterType);
    this.render();
  }

  _onDataChange() {
    this.render();
  }
}
