import {Keys} from './../utils/common.js';
import {remove, render, replace, RenderPosition} from './../utils/render.js';
import FilmCardComponent from './../components/film-card.js';
import PopupDetailFilmComponent from './../components/popup-detail-film.js';
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
    this._commentsBlock = null;
    this._filmsModel = filmsModel;
    this._commentsField = null;

    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._onCommentChange = onCommentChange;

    this._onEnterDown = this._onEnterDown.bind(this);

    this._filmCardComponent = null;
    this._popupDetailFilmComponent = null;
  }

  render(film) {
    this._film = film;

    const oldFilmCardComponent = this._filmCardComponent;
    const oldPopupDetailFilmComponent = this._popupDetailFilmComponent;

    this._mainFooter = document.querySelector(`.footer`);
    this._filmCardComponent = new FilmCardComponent(this._film);
    this._popupDetailFilmComponent = new PopupDetailFilmComponent(this._film);

    const addListenerOpenOnElementsFilmCard = () => {
      this._filmCardComponent.setTitleClickHandler(onTitleFilmClick);
      this._filmCardComponent.setPosterClickHandler(onPosterFilmClick);
      this._filmCardComponent.setCommentsClickHandler(onCommentsFilmClick);

      document.removeEventListener(`keydown`, this._onEnterDown);
      document.removeEventListener(`keydown`, onEscapeClosePopupDown);
    };

    const addListenerCloseOnElementsFilmCard = () => {
      this._popupDetailFilmComponent.setCloseClickHandler(onButtonClosePopupFilmDetail);
      document.addEventListener(`keydown`, this._onEnterDown);
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

    this._popupDetailFilmComponent.setDeleteClickHandler((idFilm, idComment) => {
      this._onCommentChange(idFilm, idComment, null);
    });

    this._filmCardComponent.setAddToWatchlistClickHandler(() => {
      this._onDataChange(this, film.id, Object.assign({}, film, {
        userDetails: {
          watchlist: !film.userDetails.watchlist,
          alreadyWatched: film.userDetails.alreadyWatched,
          favorite: film.userDetails.favorite,
          watchingDate: film.userDetails.watchingDate
        }
      }));
    });

    this._filmCardComponent.setAddMarkAsWatchedHandler(() => {
      this._onDataChange(this, film.id, Object.assign({}, film, {
        userDetails: {
          watchlist: film.userDetails.watchlist,
          alreadyWatched: !film.userDetails.alreadyWatched,
          favorite: film.userDetails.favorite,
          watchingDate: film.userDetails.watchingDate
        }
      }));
    });

    this._filmCardComponent.setAddFavorite(() => {
      this._onDataChange(this, film.id, Object.assign({}, film, {
        userDetails: {
          watchlist: film.userDetails.watchlist,
          alreadyWatched: film.userDetails.alreadyWatched,
          favorite: !film.userDetails.favorite,
          watchingDate: film.userDetails.watchingDate
        }
      }));
    });

    this._popupDetailFilmComponent.setAddToWatchlistClickHandler(() => {
      this._onDataChange(this, film.id, Object.assign({}, film, {
        userDetails: {
          watchlist: !film.userDetails.watchlist,
          alreadyWatched: film.userDetails.alreadyWatched,
          favorite: film.userDetails.favorite,
          watchingDate: film.userDetails.watchingDate
        }
      }));
    });

    this._popupDetailFilmComponent.setAddMarkAsWatchedHandler(() => {
      this._onDataChange(this, film.id, Object.assign({}, film, {
        userDetails: {
          watchlist: film.userDetails.watchlist,
          alreadyWatched: !film.userDetails.alreadyWatched,
          favorite: film.userDetails.favorite,
          watchingDate: film.userDetails.watchingDate
        }
      }));
    });

    this._popupDetailFilmComponent.setAddFavoriteHandler(() => {
      this._onDataChange(this, film.id, Object.assign({}, film, {
        userDetails: {
          watchlist: film.userDetails.watchlist,
          alreadyWatched: film.userDetails.alreadyWatched,
          favorite: !film.userDetails.favorite,
          watchingDate: film.userDetails.watchingDate
        }
      }));
    });

    if (oldFilmCardComponent && oldPopupDetailFilmComponent) {
      replace(this._filmCardComponent, oldFilmCardComponent);
      replace(this._popupDetailFilmComponent, oldPopupDetailFilmComponent);
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

  _generateComment() {
    const popupElement = this._popupDetailFilmComponent.getElement();
    const commentUserNotSanitized = popupElement.querySelector(`.film-details__comment-input`).value;
    const commentUser = encode(commentUserNotSanitized);
    const emotionComment = popupElement.querySelector(`.film-details__add-emoji-label`).dataset.emoji;

    const idComment = this._film.comments.length;
    return {
      id: idComment,
      emotion: emotionComment,
      comment: commentUser,
      author: `Джек Ворбоей`,
      date: Date.now()
    };
  }

  _onEnterDown(evt) {
    if (evt.key === Keys.ENTER) {
      const idFilm = Number(this._popupDetailFilmComponent.getElement().dataset.idFilm);
      const newComment = this._generateComment();
      this._onCommentChange(idFilm, null, newComment);
      this._popupDetailFilmComponent.rerender();
    }
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
