export default class Comments {
  constructor() {
    this._comments = [];

    this._changeCommentsHandlers = [];

    this.setAddChangeCommentsHandler = this.setAddChangeCommentsHandler.bind(this);
  }

  getComments() {
    return this._comments;
  }

  setComments(comments) {
    this._comments = comments;
  }

  addComment(idFilm, comments) {
    const commentsEdit = {
      comments,
      idFilmComments: String(idFilm)
    };

    const index = this._comments.findIndex((comment) => Number(comment.idFilmComments) === Number(idFilm));

    this._comments = [].concat(this._comments.slice(0, index), commentsEdit, this._comments.slice(index + 1));

    this._callHandlers(this._changeCommentsHandlers);
  }

  removeComment(idFilm, idComment) {
    const currentComment = this._comments.find((comment) => Number(comment.idFilmComments) === Number(idFilm));
    const index = this._comments.findIndex((comment) => Number(comment.idFilmComments) === Number(idFilm));
    const indexDelete = currentComment.comments.findIndex((comment) => Number(comment.id) === (idComment));

    currentComment.comments = [].concat(currentComment.comments.slice(0, indexDelete), currentComment.comments.slice(indexDelete + 1));

    this._comments = [].concat(this._comments.slice(0, index), currentComment, this._comments.slice(index + 1));

    this._callHandlers(this._changeCommentsHandlers);
  }

  setAddChangeCommentsHandler(handler) {
    this._changeCommentsHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
