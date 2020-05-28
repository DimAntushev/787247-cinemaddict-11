export default class Films {
  constructor(films) {
    this._films = films;

    this._dataChangeHandlers = [];
  }

  getFilms() {
    return this._films;
  }

  setFilms(films) {
    this._films = films;
    this._callHandlers();
  }

  updateFilm(id, newFilm) {
    const index = this._films.findIndex((film) => film.id === id);

    if (index !== -1) {
      return false;
    }

    this._films = [].concat(this._films.slice(0, index), newFilm, this._films.slice(index + 1));

    return true;
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
