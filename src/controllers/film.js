import {Keys} from './../utils/common.js';
import {remove, render, replace, RenderPosition} from './../utils/render.js';
import FilmCardComponent from './../components/film-card.js';
import PopupDetailFilmComponent from './../components/popup-detail-film.js';

const Mode = {
  OPEN: `open`,
  CLOSE: `close`
};

export default class FilmController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._mode = null;

    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._filmCardComponent = null;
    this._popupDetailFilmComponent = null;
  }

  render(film) {
    const oldFilmCardComponent = this._filmCardComponent;
    const oldPopupDetailFilmComponent = this._popupDetailFilmComponent;

    this._mainFooter = document.querySelector(`.footer`);
    this._filmCardComponent = new FilmCardComponent(film);
    this._popupDetailFilmComponent = new PopupDetailFilmComponent(film);

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
      this._onDataChange(this, film, Object.assign({}, film, {
        userDetails: {
          watchlist: !film.userDetails.watchlist,
          alreadyWatched: film.userDetails.alreadyWatched,
          favorite: film.userDetails.favorite,
          watchingDate: film.userDetails.watchingDate
        }
      }));
    });

    this._filmCardComponent.setAddMarkAsWatchedHandler(() => {
      this._onDataChange(this, film, Object.assign({}, film, {
        userDetails: {
          watchlist: film.userDetails.watchlist,
          alreadyWatched: !film.userDetails.alreadyWatched,
          favorite: film.userDetails.favorite,
          watchingDate: film.userDetails.watchingDate
        }
      }));
    });

    this._filmCardComponent.setAddFavorite(() => {
      this._onDataChange(this, film, Object.assign({}, film, {
        userDetails: {
          watchlist: film.userDetails.watchlist,
          alreadyWatched: film.userDetails.alreadyWatched,
          favorite: !film.userDetails.favorite,
          watchingDate: film.userDetails.watchingDate
        }
      }));
    });

    this._popupDetailFilmComponent.setAddToWatchlistClickHandler(() => {
      this._onDataChange(this, film, Object.assign({}, film, {
        userDetails: {
          watchlist: !film.userDetails.watchlist,
          alreadyWatched: film.userDetails.alreadyWatched,
          favorite: film.userDetails.favorite,
          watchingDate: film.userDetails.watchingDate
        }
      }));
    });

    this._popupDetailFilmComponent.setAddMarkAsWatchedHandler(() => {
      this._onDataChange(this, film, Object.assign({}, film, {
        userDetails: {
          watchlist: film.userDetails.watchlist,
          alreadyWatched: !film.userDetails.alreadyWatched,
          favorite: film.userDetails.favorite,
          watchingDate: film.userDetails.watchingDate
        }
      }));
    });

    this._popupDetailFilmComponent.setAddFavoriteHandler(() => {
      this._onDataChange(this, film, Object.assign({}, film, {
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

  _showPopupFilm() {
    this._onViewChange();
    this._mode = Mode.OPEN;
    render(this._mainFooter, this._popupDetailFilmComponent, RenderPosition.AFTEREND);
  }

  _closePopupFilm() {
    this._mode = Mode.CLOSE;
    this._popupDetailFilmComponent.reset();
    remove(this._popupDetailFilmComponent);
  }


  setDefaultView() {
    if (this._mode === Mode.OPEN) {
      this._closePopupFilm();
    }
  }
}
