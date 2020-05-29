import {Keys} from './../utils/common.js';
import {remove, render, replace, RenderPosition} from './../utils/render.js';
import CommentsModel from './../models/comments.js';
import FilmCardComponent from './../components/film-card.js';
import PopupDetailFilmComponent from './../components/popup-detail-film.js';
import CommentsController from './../controllers/comments.js';

const Mode = {
  OPEN: `open`,
  CLOSE: `close`
};

export default class FilmController {
  constructor(container, onDataChange, onViewChange, filmsModel) {
    this._container = container;
    this._mode = null;
    this._film = null;
    this._commentsBlock = null;
    this._filmsModel = filmsModel;

    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._onCommentChange = this._onCommentChange.bind(this);

    this._commentsModel = new CommentsModel();
    this._commentsModel.setAddChangeCommentsHandler(this._onCommentChange);

    this._filmCardComponent = null;
    this._popupDetailFilmComponent = null;
    this._commentsController = null;
  }

  render(film) {
    this._film = film;

    this._commentsModel.setComments(this._film.comments);

    const oldFilmCardComponent = this._filmCardComponent;
    const oldPopupDetailFilmComponent = this._popupDetailFilmComponent;

    this._mainFooter = document.querySelector(`.footer`);
    this._filmCardComponent = new FilmCardComponent(this._film);
    this._popupDetailFilmComponent = new PopupDetailFilmComponent(this._film);

    const commentsBlock = this._popupDetailFilmComponent.getElement()
      .querySelector(`.form-details__bottom-container`);

    this._commentsController = new CommentsController(commentsBlock, this._commentsModel, this._filmsModel, this._onCommentChange);
    this._commentsController.render();

    const addListenerOpenOnElementsFilmCard = () => {
      this._filmCardComponent.setTitleClickHandler(onTitleFilmClick);
      this._filmCardComponent.setPosterClickHandler(onPosterFilmClick);
      this._filmCardComponent.setCommentsClickHandler(onCommentsFilmClick);

      document.removeEventListener(`keydown`, onEscapeClosePopupDown);
    };

    const addListenerCloseOnElementsFilmCard = () => {
      this._popupDetailFilmComponent.setCloseClickHandler(onButtonClosePopupFilmDetail);
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

  _showPopupFilm() {
    this._onViewChange();
    this._mode = Mode.OPEN;
    render(this._mainFooter, this._popupDetailFilmComponent, RenderPosition.AFTEREND);
  }

  _closePopupFilm() {
    this._mode = Mode.CLOSE;
    remove(this._popupDetailFilmComponent);
  }

  _onCommentChange(commentsController, idComment, newComment) {
    let isSuccess;
    if (newComment === null) {
      isSuccess = this._commentsModel.removeComment(idComment);
    }

    if (idComment === null) {
      isSuccess = this._commentsModel.addComment(newComment);
    }

    if (isSuccess) {
      commentsController.render();
    }
  }
}
