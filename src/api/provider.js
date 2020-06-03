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

const getOnlineStatus = () => {
  return window.navigator.onLine;
};

export default class Provider {
  constructor(api, storeFilms, storeComments) {
    this._api = api;
    this._storeFilms = storeFilms;
    this._storeComments = storeComments;
  }

  getFilms() {
    if (getOnlineStatus()) {
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
    if (getOnlineStatus()) {
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
    if (getOnlineStatus()) {
      return this._api.getComments(idFilm)
        .then((comments) => {

          const localStoreComments = createStoreStructureComment(idFilm, comments);

          this._storeComments.setItem(idFilm, localStoreComments);

          return comments;
        });
    }

    const storeComments = Object.values(this._storeComments.getItems());

    const localCommentsFilm = filterLocalComments(idFilm, storeComments);

    return Promise.resolve(CommentAdapter.parseComments(localCommentsFilm.commentsFilm));
  }

  removeComment(idFilm) {
    if (getOnlineStatus()) {
      return this._api.removeComment(idFilm);
    }

    return Promise.reject();
  }

  addComment(idFilm, newComment) {
    if (getOnlineStatus()) {
      return this._api.addComment(idFilm, newComment);
    }

    return Promise.reject();
  }

  sync() {
    if (getOnlineStatus()) {
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
