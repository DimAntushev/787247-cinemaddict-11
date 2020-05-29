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

  addComment(newComment) {
    this._comments = [].concat(this._comments, newComment);
    this._callHandlers(this._changeCommentsHandlers);
  }

  removeComment(id) {
    const index = this._comments.findIndex((comment) => comment.id === id);

    if (index === -1) {
      return false;
    }

    this._comments = [].concat(this._comments.slice(0, index), this._comments.slice(index + 1));

    this._callHandlers(this._changeCommentsHandlers);

    return true;
  }

  setAddChangeCommentsHandler(handler) {
    this._changeCommentsHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
