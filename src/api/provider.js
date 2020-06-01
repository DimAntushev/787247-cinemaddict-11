import FilmAdapter from '../models/film-adapter.js';

const getSyncedFilms = (films) => {
  return films.filter(({success}) => success)
    .map(({payload}) => payload.film);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

const isOnline = () => {
  return window.navigator.onLine;
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getFilms() {
    if (isOnline()) {
      console.log(`Онлайн`);
      return this._api.getFilms()
        .then((films) => {
          const filmsStructure = createStoreStructure(films.map((film) => film.toRAW()));

          this._store.setItems(filmsStructure);

          return filmsStructure;
        });
    }

    const storeFilms = Object.values(this._store.getItems());

    return Promise.resolve(FilmAdapter.parseFilms(storeFilms));
  }

  updateFilm(id, film) {
    if (isOnline()) {
      return this._api.updateFilm(id, film)
        .then((newFilm) => {
          this._store.setItem(newFilm.id, newFilm.toRAW());

          return newFilm;
        });
    }

    const localFilm = FilmAdapter.clone(Object.assign(film, {id}));

    this._store.setItem(id, localFilm.toRAW());

    return Promise.resolve(localFilm);
  }

  getComments(idFilm) {
    if (isOnline()) {
      return this._api.getComments(idFilm);
    }

    return Promise.reject();
  }

  removeComment(idFilm) {
    if (isOnline()) {
      return this._api.removeComment(idFilm);
    }

    return Promise.reject();
  }

  addComment(idFilm, newComment) {
    if (isOnline()) {
      return this._api.addComment(idFilm, newComment);
    }

    return Promise.reject();
  }

  sync() {
    if (isOnline()) {
      const storeFilms = Object.values(this._store.getItems());

      return this._api.sync(storeFilms)
        .then((response) => {
          const createdTasks = getSyncedFilms(response.created);
          const updatedTasks = getSyncedFilms(response.updated);

          const items = createStoreStructure([...createdTasks, ...updatedTasks]);

          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error(`Синхронизация данных не удалась`));
  }
}
