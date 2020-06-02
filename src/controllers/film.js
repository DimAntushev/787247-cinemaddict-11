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

export default class FilmController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._mode = null;
    this._film = null;

    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._filmCardComponent = null;
    this._popupDetailFilmComponent = null;
  }

  render(film) {
    this._film = film;

    apiWithProvider.getComments(film.id)
      .then((comments) => {
        const oldFilmCardComponent = this._filmCardComponent;
        const oldPopupDetailFilmComponent = this._popupDetailFilmComponent;

        this._filmCardComponent = new FilmCardComponent(this._film, comments);
        this._popupDetailFilmComponent = new PopupDetailFilmComponent(this._film, comments);

        this._mainFooter = document.querySelector(`.footer`);

        const onEnterDown = (evt) => {
          const isKeysDown = (evt.ctrlKey || evt.meta) && evt.key === Keys.ENTER;
          if (isKeysDown) {
            const idFilm = Number(this._popupDetailFilmComponent.getElement().dataset.idFilm);
            let newComment = this._generateComment();
            newComment = new CommentAdapter(newComment);
            newComment.toRAW();

            apiWithProvider.addComment(idFilm, newComment)
              .then(() => {
                this._popupDetailFilmComponent.disabledForm();
                this.render(this._film);
              })
              .catch(() => {
                this._popupDetailFilmComponent.errorForm();
              });

            this._popupDetailFilmComponent.rerender();
          }
        };

        const addListenerOpenOnElementsFilmCard = () => {
          this._filmCardComponent.setTitleClickHandler(onTitleFilmClick);
          this._filmCardComponent.setPosterClickHandler(onPosterFilmClick);
          this._filmCardComponent.setCommentsClickHandler(onCommentsFilmClick);
          if (oldPopupDetailFilmComponent) {
            this._popupDetailFilmComponent.setCloseClickHandler(onButtonClosePopupFilmDetail);
          }

          document.removeEventListener(`keydown`, onEnterDown);
          document.removeEventListener(`keydown`, onEscapeClosePopupDown);
        };

        const addListenerCloseOnElementsFilmCard = () => {
          this._popupDetailFilmComponent.setCloseClickHandler(onButtonClosePopupFilmDetail);
          document.addEventListener(`keydown`, onEnterDown);
          document.addEventListener(`keydown`, onEscapeClosePopupDown);
        };

        const onTitleFilmClick = () => {
          this._showPopupFilm();

          addListenerCloseOnElementsFilmCard();

          this._filmCardComponent.removeTitleClickHandler(onPosterFilmClick);
          this._filmCardComponent.removePosterClickHandler(onCommentsFilmClick);
        };

        const onPosterFilmClick = () => {
          this._showPopupFilm();

          addListenerCloseOnElementsFilmCard();

          this._filmCardComponent.removeTitleClickHandler(onTitleFilmClick);
          this._filmCardComponent.removeCommentsClickHandler(onCommentsFilmClick);
        };

        const onCommentsFilmClick = () => {
          this._showPopupFilm();

          addListenerCloseOnElementsFilmCard();

          this._filmCardComponent.removeTitleClickHandler(onTitleFilmClick);
          this._filmCardComponent.removePosterClickHandler(onPosterFilmClick);
        };

        const onButtonClosePopupFilmDetail = () => {
          this._closePopupFilm();

          addListenerOpenOnElementsFilmCard();

          this._popupDetailFilmComponent.removeCloseClickHandler(onButtonClosePopupFilmDetail);
        };

        const onEscapeClosePopupDown = (evt) => {
          const isEscape = evt.key === Keys.ESCAPE || evt.key === Keys.ESC;
          if (isEscape) {
            this._closePopupFilm();

            addListenerOpenOnElementsFilmCard();
          }
        };

        addListenerOpenOnElementsFilmCard();

        // Датабиндинг

        this._popupDetailFilmComponent.setDeleteClickHandler((idComment, currentButton, currentList) => {
          apiWithProvider.removeComment(idComment)
            .then(() => {
              this._popupDetailFilmComponent.disabledButton(currentButton, currentList);

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

        if (oldFilmCardComponent && oldPopupDetailFilmComponent) {
          replace(this._filmCardComponent, oldFilmCardComponent);
          replace(this._popupDetailFilmComponent, oldPopupDetailFilmComponent);
        } else {
          render(this._container, this._filmCardComponent);
        }
      });
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
    const popupElement = this._popupDetailFilmComponent.getElement();
    const commentUserNotSanitized = popupElement.querySelector(`.film-details__comment-input`).value;
    const commentUser = encode(commentUserNotSanitized);
    const emotionComment = popupElement.querySelector(`.film-details__add-emoji-label`).dataset.emoji;
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
    render(this._mainFooter, this._popupDetailFilmComponent, RenderPosition.AFTEREND);
  }

  _closePopupFilm() {
    this._popupDetailFilmComponent.resetCommentFilter();
    this._mode = Mode.CLOSE;
    remove(this._popupDetailFilmComponent);
  }
}
