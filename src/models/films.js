import {FilterType} from './../const.js';
import {getFilmsByFilter} from './../utils/filters.js';

export default class Films {
  constructor(films) {
    this._films = films;
    this._activeFilter = FilterType.ALL;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];

    this.setDataChangeHandler = this.setDataChangeHandler.bind(this);
    this.setFilterChangeHandler = this.setFilterChangeHandler.bind(this);
  }

  getFilmsAll() {
    return this._films;
  }

  getFilms(filterType) {
    return getFilmsByFilter(this._films, filterType);
  }

  setFilms(films) {
    this._films = films;
    this._callHandlers(this._dataChangeHandlers);
  }

  updateFilm(id, newFilm) {
    const index = this._films.findIndex((film) => film.id === id);

    if (index === -1) {
      return false;
    }

    this._films = [].concat(this._films.slice(0, index), newFilm, this._films.slice(index + 1));
    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  getFilter() {
    return this._activeFilter;
  }

  setFilter(filterType) {
    this._activeFilter = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
