import {FilterType} from './../const.js';
import {getFilmsByFilter} from './../utils/filters.js';

export default class Films {
  constructor() {
    this._films = [];
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
    this._films = Array.from(films);
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

  addComment(idFilm, newComment) {
    const filmFind = this._films.find((film) => film.id === idFilm);
    const filmIndex = this._films.findIndex((film) => film.id === idFilm);
    filmFind.comments.push(newComment);

    this._films = [].concat(this._films.slice(0, filmIndex), filmFind, this._films.slice(filmIndex + 1));
  }

  removeComment(idFilm, idComment) {
    const filmFind = this._films.find((film) => film.id === idFilm);
    const filmIndex = this._films.findIndex((film) => film.id === idFilm);
    const indexComment = filmFind.comments.findIndex((comment) => comment.id === idComment);

    if (indexComment === -1) {
      return false;
    }

    filmFind.comments = [].concat(filmFind.comments.slice(0, indexComment), filmFind.comments.slice(indexComment + 1));
    this._films = [].concat(this._films.slice(0, filmIndex), filmFind, this._films.slice(filmIndex + 1));

    return true;
  }

  getWatchedFilms() {
    return this._films.filter((film) => film.userDetails.alreadyWatched);
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
