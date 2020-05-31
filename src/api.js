import FilmAdapter from './models/film-adapter.js';
import CommentAdapter from './models/comment-adapter.js';

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
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

  updateFilm(id, data) {
    return this._load({
      method: Method.PUT,
      url: `movies/${id}`,
      headers: new Headers({"Content-Type": `application/json`}),
      body: JSON.stringify(data.toRAW())
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
      method: `DELETE`,
      url: `comments/${idComment}`
    });
  }

  addComment(idFilm, newComment) {
    return this._load({
      method: Method.POST,
      url: `comments/${idFilm}`,
      headers: new Headers({"Content-Type": `application/json`}),
      body: JSON.stringify(newComment.toRAW())
    })
      .then((response) => response.json())
      .then(CommentAdapter.parseCommentOfAdd);
  }


  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((error) => {
        throw error;
      });
  }
}
