import {Keys} from './../utils/common.js';
import {remove, render, replace, RenderPosition} from './../utils/render.js';
import FilmCardComponent from './../components/film-card.js';
import PopupDetailFilmComponent from './../components/popup-detail-film.js';
import FilmModel from '../models/film-adapter.js';
import CommentAdapter from '../models/comment-adapter.js';
import {api} from '../main.js';
import {encode} from 'he';

const Mode = {
  OPEN: `open`,
  CLOSE: `close`
};

export default class FilmController {
  constructor(container, onDataChange, onViewChange, onCommentChange, filmsModel) {
    this._container = container;
    this._mode = null;
    this._film = null;
    this._comments = null;
    this._commentsBlock = null;
    this._filmsModel = filmsModel;
    this._commentsField = null;

    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._onCommentChange = onCommentChange;

    this._filmCardComponent = null;
    this._popupDetailFilmComponent = null;
  }

  render(film) {
    this._film = film;

    const oldFilmCardComponent = this._filmCardComponent;
    const oldPopupDetailFilmComponent = this._popupDetailFilmComponent;

    api.getComments(this._film.id)
      .then((comments) => {
        const onEnterDown = (evt) => {
          const isKeysDown = (evt.ctrlKey || evt.meta) && evt.key === Keys.ENTER;
          if (isKeysDown) {
            const idFilm = Number(this._popupDetailFilmComponent.getElement().dataset.idFilm);
            let newComment = this._generateComment();
            newComment = new CommentAdapter(newComment);
            newComment.toRAW();

            api.addComment(idFilm, newComment)
              .then(() => {
                this._popupDetailFilmComponent.disabledForm();
                this.render(this._film);
              })
              .catch(() => {
                this._popupDetailFilmComponent.activateForm();
              });

            this._popupDetailFilmComponent.rerender();
          }
        };

        this._filmCardComponent = new FilmCardComponent(this._film, comments);
        this._popupDetailFilmComponent = new PopupDetailFilmComponent(this._film, comments);

        this._mainFooter = document.querySelector(`.footer`);

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

        this._popupDetailFilmComponent.setDeleteClickHandler((idComment) => {
          api.removeComment(idComment)
            .then(() => {
              this.render(this._film);
            });
        });

        this._filmCardComponent.setAddToWatchlistClickHandler(() => {
          const newFilm = FilmModel.clone(this._film);
          newFilm.userDetails.watchlist = !newFilm.userDetails.watchlist;

          this._onDataChange(this, film.id, newFilm);
        });

        this._filmCardComponent.setAddMarkAsWatchedHandler(() => {
          const newFilm = FilmModel.clone(this._film);
          newFilm.userDetails.alreadyWatched = !newFilm.userDetails.alreadyWatched;

          this._onDataChange(this, film.id, newFilm);
        });

        this._filmCardComponent.setAddFavorite(() => {
          const newFilm = FilmModel.clone(this._film);
          newFilm.userDetails.favorite = !newFilm.userDetails.favorite;

          this._onDataChange(this, film.id, newFilm);
        });

        this._popupDetailFilmComponent.setAddToWatchlistClickHandler(() => {
          const newFilm = FilmModel.clone(this._film);
          newFilm.userDetails.watchlist = !newFilm.userDetails.watchlist;

          this._onDataChange(this, film.id, newFilm);
        });

        this._popupDetailFilmComponent.setAddMarkAsWatchedHandler(() => {
          const newFilm = FilmModel.clone(this._film);
          newFilm.userDetails.alreadyWatched = !newFilm.userDetails.alreadyWatched;

          this._onDataChange(this, film.id, newFilm);
        });

        this._popupDetailFilmComponent.setAddFavoriteHandler(() => {
          const newFilm = FilmModel.clone(this._film);
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
