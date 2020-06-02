import FilmAdapter from '../models/film-adapter.js';
import CommentAdapter from '../models/comment-adapter.js';

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

const createStoreStructureComment = (idFilm, comments) => {
  return {
    id: idFilm,
    commentsFilm: comments
  };
};

const filterLocalComments = (idFilm, comments) => {
  return comments.find((comment) => {
    return comment.id === idFilm;
  });
};

const isOnline = () => {
  return window.navigator.onLine;
};

export default class Provider {
  constructor(api, storeFilms, storeComment) {
    this._api = api;
    this._storeFilms = storeFilms;
    this._storeComment = storeComment;
  }

  getFilms() {
    if (isOnline()) {
      return this._api.getFilms()
        .then((films) => {
          const filmsLocal = createStoreStructure(films.map((film) => film.toRAW()));

          this._storeFilms.setItems(filmsLocal);

          return films;
        });
    }

    const storeFilms = Object.values(this._storeFilms.getItems());

    return Promise.resolve(FilmAdapter.parseFilms(storeFilms));
  }

  updateFilm(id, film) {
    if (isOnline()) {
      return this._api.updateFilm(id, film)
        .then((newFilm) => {
          this._storeFilms.setItem(newFilm.id, newFilm.toRAW());

          return newFilm;
        });
    }

    const localFilm = FilmAdapter.clone(Object.assign(film, {id}));

    this._storeFilms.setItem(id, localFilm.toRAW());

    return Promise.resolve(localFilm);
  }

  getComments(idFilm) {
    if (isOnline()) {
      return this._api.getComments(idFilm)
        .then((comments) => {

          const localStoreComments = createStoreStructureComment(idFilm, comments);

          this._storeComment.setItem(idFilm, localStoreComments);

          return comments;
        });
    }

    const storeComments = Object.values(this._storeComment.getItems());

    const localCommentsFilm = filterLocalComments(idFilm, storeComments);

    return Promise.resolve(CommentAdapter.parseComments(localCommentsFilm.commentsFilm));
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
      const storeFilms = Object.values(this._storeFilms.getItems());

      return this._api.sync(storeFilms)
        .then((response) => {
          const updatedFilms = getSyncedFilms(response.updated);

          const items = createStoreStructure([...updatedFilms]);

          this._storeFilms.setItems(items);
        });
    }

    return Promise.reject(new Error(`Синхронизация данных не удалась`));
  }
}
