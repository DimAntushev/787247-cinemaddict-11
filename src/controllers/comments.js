import {render, replace} from './../utils/render.js';
import CommentsComponent from './../components/comments.js';
import {getRandomElementFromArray, Keys} from "../utils/common";

export default class CommentsController {
  constructor(container, commentsModel, filmsModel, onCommentChange) {
    this._container = container;

    this._onCommentChange = onCommentChange;

    this._commentsComponent = null;

    this._commentsModel = commentsModel;
    this._filmsModel = filmsModel;
  }

  render() {
    const oldCommentsComponent = this._commentsComponent;

    this._commentsComponent = new CommentsComponent(this._commentsModel.getComments());
    this._commentsComponent.setDeleteClickHandler((idComment) => {
      this._onCommentChange(this, idComment, null);
    });

    if (oldCommentsComponent) {
      replace(this._commentsComponent, oldCommentsComponent);
    } else {
      render(this._container, this._commentsComponent);
    }
  }
}
