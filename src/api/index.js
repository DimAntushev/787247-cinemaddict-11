import FilmAdapter from '../models/film-adapter.js';
import CommentAdapter from '../models/comment-adapter.js';

const RESPONSE_STATUS_MIN = 200;
const RESPONSE_STATUS_MAX = 300;


const Methods = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const checkStatus = (response) => {
  if (response.status >= RESPONSE_STATUS_MIN && response.status < RESPONSE_STATUS_MAX) {
    return response;
  } else {
    throw Error(`${response.status}: ${response.statusText}`);
  }
};

export default class API {
  constructor(authorization, endPoint) {
    this._authorization = authorization;
    this._endPoint = endPoint;
  }

  getFilms() {
    return this._load({url: `movies/`})
      .then((response) => response.json())
      .then(FilmAdapter.parseFilms);
  }

  updateFilm(id, film) {
    return this._load({
      method: Methods.PUT,
      url: `movies/${id}`,
      headers: new Headers({"Content-Type": `application/json`}),
      body: JSON.stringify(film.toRAW())
    })
      .then((response) => response.json())
      .then(FilmAdapter.parseFilm);
  }

  getComments(idFilm) {
    return this._load({
      url: `comments/${idFilm}`,
    })
      .then((response) => response.json())
      .then(CommentAdapter.parseComments);
  }

  removeComment(idComment) {
    return this._load({
      method: Methods.DELETE,
      url: `comments/${idComment}`
    });
  }

  addComment(idFilm, newComment) {
    return this._load({
      method: Methods.POST,
      url: `comments/${idFilm}`,
      headers: new Headers({"Content-Type": `application/json`}),
      body: JSON.stringify(newComment.toRAW())
    })
      .then((response) => response.json())
      .then(CommentAdapter.parseCommentOfAdd);
  }

  sync(films) {
    return this._load({
      method: Methods.POST,
      url: `movies/sync`,
      body: JSON.stringify(films),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json());
  }

  _load({url, method = Methods.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((error) => {
        throw error;
      });
  }
}
