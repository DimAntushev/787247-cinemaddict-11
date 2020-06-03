import {Keys} from './../utils/common.js';
import {remove, render, replace, RenderPosition} from './../utils/render.js';

import FilmCardComponent from './../components/film-card.js';
import PopupDetailFilmComponent from './../components/popup-detail-film.js';

import FilmAdapter from '../models/film-adapter.js';
import CommentAdapter from '../models/comment-adapter.js';

import {apiWithProvider, commentsModel} from '../main.js';
import {encode} from 'he';

const Mode = {
  OPEN: `open`,
  CLOSE: `close`
};

const mainFooterElement = document.querySelector(`.footer`);

const getComment = (idFilm, comments) => {
  return comments.find((comment) => {
    return comment.idFilmComments === idFilm;
  });
};

export default class FilmController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._mode = null;
    this._film = null;

    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;


    this._addListenerOpenOnElementsFilmCard = this._addListenerOpenOnElementsFilmCard.bind(this);
    this._addListenerCloseOnElementsFilmCard = this._addListenerCloseOnElementsFilmCard.bind(this);
    this._onPosterFilmClick = this._onPosterFilmClick.bind(this);
    this._onTitleFilmClick = this._onTitleFilmClick.bind(this);
    this._onCommentsFilmClick = this._onCommentsFilmClick.bind(this);
    this._onEscapeClosePopupDown = this._onEscapeClosePopupDown.bind(this);
    this._onButtonClosePopupFilmDetail = this._onButtonClosePopupFilmDetail.bind(this);
    this._onEnterDown = this._onEnterDown.bind(this);

    this._filmCardComponent = null;
    this._popupDetailFilmComponent = null;

    this._oldFilmCardComponent = null;
    this._oldPopupDetailFilmComponent = null;
  }

  render(film) {
    this._film = film;

    const commentsAll = commentsModel.getComments();
    const comments = getComment(film.id, commentsAll).comments;

    this._oldFilmCardComponent = this._filmCardComponent;
    this._oldPopupDetailFilmComponent = this._popupDetailFilmComponent;

    this._filmCardComponent = new FilmCardComponent(this._film, comments);
    this._popupDetailFilmComponent = new PopupDetailFilmComponent(this._film, comments);

    this._addListenerOpenOnElementsFilmCard();

    this._popupDetailFilmComponent.setDeleteClickHandler((idFilm, idComment, currentButton, currentList) => {
      apiWithProvider.removeComment(idComment)
        .then(() => {
          this._popupDetailFilmComponent.disabledButton(currentButton, currentList);
          commentsModel.removeComment(idFilm, idComment);
          this.render(this._film, comments);
        })
        .catch(() => {
          this._popupDetailFilmComponent.errorButton(currentButton, currentList);
        });
    });

    this._filmCardComponent.setAddToWatchlistClickHandler(() => {
      const newFilm = FilmAdapter.clone(this._film);
      newFilm.userDetails.watchlist = !newFilm.userDetails.watchlist;

      this._onDataChange(this, film.id, newFilm);
    });

    this._filmCardComponent.setAddMarkAsWatchedHandler(() => {
      const newFilm = FilmAdapter.clone(this._film);
      newFilm.userDetails.alreadyWatched = !newFilm.userDetails.alreadyWatched;
      newFilm.userDetails.watchingDate = new Date().toISOString();

      this._onDataChange(this, film.id, newFilm);
    });

    this._filmCardComponent.setAddFavorite(() => {
      const newFilm = FilmAdapter.clone(this._film);
      newFilm.userDetails.favorite = !newFilm.userDetails.favorite;

      this._onDataChange(this, film.id, newFilm);
    });

    this._popupDetailFilmComponent.setAddToWatchlistClickHandler(() => {
      const newFilm = FilmAdapter.clone(this._film);
      newFilm.userDetails.watchlist = !newFilm.userDetails.watchlist;

      this._onDataChange(this, film.id, newFilm);
    });

    this._popupDetailFilmComponent.setAddMarkAsWatchedHandler(() => {
      const newFilm = FilmAdapter.clone(this._film);
      newFilm.userDetails.alreadyWatched = !newFilm.userDetails.alreadyWatched;

      this._onDataChange(this, film.id, newFilm);
    });

    this._popupDetailFilmComponent.setAddFavoriteHandler(() => {
      const newFilm = FilmAdapter.clone(this._film);
      newFilm.userDetails.favorite = !newFilm.userDetails.favorite;

      this._onDataChange(this, film.id, newFilm);
    });

    if (this._oldFilmCardComponent && this._oldPopupDetailFilmComponent) {
      replace(this._filmCardComponent, this._oldFilmCardComponent);
      replace(this._popupDetailFilmComponent, this._oldPopupDetailFilmComponent);
    } else {
      render(this._container, this._filmCardComponent);
    }
  }

  destroy() {
    remove(this._filmCardComponent);
    remove(this._popupDetailFilmComponent);
  }

  setDefaultView() {
    if (this._mode === Mode.OPEN) {
      this._closePopupFilm();
    }
  }

  disabledForm() {
    this._popupDetailFilmComponent.disabledFormOffline();
  }

  activeForm() {
    this._popupDetailFilmComponent.activeFormOnline();
  }

  _generateComment() {
    const commentUserNotSanitized = this._popupDetailFilmComponent.getCommentText();
    const commentUser = encode(commentUserNotSanitized);
    const emotionComment = this._popupDetailFilmComponent.getCurrentEmoji();
    const dateNow = new Date();
    return {
      emotion: emotionComment,
      comment: commentUser,
      date: dateNow.toISOString()
    };
  }

  _showPopupFilm() {
    this._onViewChange();
    this._mode = Mode.OPEN;
    render(mainFooterElement, this._popupDetailFilmComponent, RenderPosition.AFTEREND);
  }

  _closePopupFilm() {
    this._popupDetailFilmComponent.resetCommentFilter();
    this._mode = Mode.CLOSE;
    remove(this._popupDetailFilmComponent);
  }

  _addListenerOpenOnElementsFilmCard() {
    this._filmCardComponent.setTitleClickHandler(this._onTitleFilmClick);
    this._filmCardComponent.setPosterClickHandler(this._onPosterFilmClick);
    this._filmCardComponent.setCommentsClickHandler(this._onCommentsFilmClick);

    document.removeEventListener(`keydown`, this._onEnterDown);
    document.removeEventListener(`keydown`, this._onEscapeClosePopupDown);
    if (this._oldPopupDetailFilmComponent) {
      this._addListenerCloseOnElementsFilmCard();
    }
  }

  _addListenerCloseOnElementsFilmCard() {
    this._popupDetailFilmComponent.setCloseClickHandler(this._onButtonClosePopupFilmDetail);
    document.addEventListener(`keydown`, this._onEnterDown);
    document.addEventListener(`keydown`, this._onEscapeClosePopupDown);
  }

  _onEnterDown(evt) {
    const isKeysDown = (evt.ctrlKey || evt.meta) && evt.key === Keys.ENTER;
    if (isKeysDown) {
      const idFilm = Number(this._popupDetailFilmComponent.getElement().dataset.idFilm);
      let newComment = this._generateComment();
      newComment = new CommentAdapter(newComment);
      newComment.toRAW();

      apiWithProvider.addComment(idFilm, newComment)
        .then((newComments) => {
          this._popupDetailFilmComponent.disabledForm();
          commentsModel.addComment(idFilm, newComments);
          this.render(this._film);
        })
        .catch(() => {
          this._popupDetailFilmComponent.errorForm();
        });

      this._popupDetailFilmComponent.rerender();
    }
  }

  _onEscapeClosePopupDown(evt) {
    const isEscape = evt.key === Keys.ESCAPE || evt.key === Keys.ESC;
    if (isEscape) {
      this._closePopupFilm();

      this._addListenerOpenOnElementsFilmCard();
    }
  }

  _onTitleFilmClick() {
    this._showPopupFilm();

    this._addListenerCloseOnElementsFilmCard();

    this._filmCardComponent.removeTitleClickHandler(this._onPosterFilmClick);
    this._filmCardComponent.removePosterClickHandler(this._onCommentsFilmClick);
  }

  _onPosterFilmClick() {
    this._showPopupFilm();

    this._addListenerCloseOnElementsFilmCard();

    this._filmCardComponent.removeTitleClickHandler(this._onTitleFilmClick);
    this._filmCardComponent.removeCommentsClickHandler(this._onPosterFilmClick);
  }

  _onCommentsFilmClick() {
    this._showPopupFilm();

    this._addListenerCloseOnElementsFilmCard();

    this._filmCardComponent.removeTitleClickHandler(this._onTitleFilmClick);
    this._filmCardComponent.removePosterClickHandler(this._onPosterFilmClick);
  }

  _onButtonClosePopupFilmDetail() {
    this._closePopupFilm();

    this._addListenerOpenOnElementsFilmCard();

    this._popupDetailFilmComponent.removeCloseClickHandler(this._onButtonClosePopupFilmDetail);
  }
}
