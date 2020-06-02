import {apiWithProvider} from './../main.js';
import {FilterType} from './../const.js';
import {remove, render} from '../utils/render';
import NoFilmsComponent from '../components/index-no-data';
import MoreButtonFilmsComponent from '../components/more-button';
import MainBlockFilmsComponent from '../components/main-block-films';
import FilmsAllComponent from '../components/films-all';
import FilmsTopComponent from '../components/films-top';
import FilmsMostCommentComponent from '../components/films-most-comment';
import SortsComponent from '../components/sorts';

import FilmController from './film.js';

import {sorts} from './../utils/sorts.js';
import {SortType} from './../utils/sorts.js';

const FILMS_NUMBER_COUNT = 5;
const FILMS_TOP_RATED = 2;
const FILMS_MOST_COMMENTED = 2;

const sortingDateFilms = (films) => {
  return films.slice().sort((filmCurrent, filmNext) => {
    const filmCurrentDate = new Date(filmCurrent.filmInfo.release.date);
    const filmNextDate = new Date(filmNext.filmInfo.release.date);
    return Number(filmNextDate) - Number(filmCurrentDate);
  });
};
const sortingRatingFilms = (films) => {
  return films.slice().sort((filmCurrent, filmNext) => {
    return Number(filmNext.filmInfo.totalRating) - Number(filmCurrent.filmInfo.totalRating);
  });
};
const sortingFilms = (films, filmsDefault, sortName) => {
  if (sortName === SortType.DATE) {
    return sortingDateFilms(films);
  }

  if (sortName === SortType.RATING) {
    return sortingRatingFilms(films);
  }

  films = filmsDefault;

  return films;
};

const renderMainFilmCards = (filmCards, filmList, startShowCardsLoad, onDataChange, onViewChange) => {
  const filmsCardsLoad = filmCards.slice(startShowCardsLoad, startShowCardsLoad + FILMS_NUMBER_COUNT);
  return renderFilmCards(filmsCardsLoad, filmList, onDataChange, onViewChange);
};
const renderTopFilmCards = (filmCards, filmList, onDataChange, onViewChange) => {
  return renderFilmCards(filmCards, filmList, onDataChange, onViewChange);
};
const renderMostCommentListCards = (filmCards, filmList, onDataChange, onViewChange) => {
  return renderFilmCards(filmCards, filmList, onDataChange, onViewChange);
};

const renderShowMoreButton = (filmListMainComponent, buttonShowMoreComponent) => {
  render(filmListMainComponent.getElement(), buttonShowMoreComponent);
};

const renderMainBlockForFilms = (mainBlockContent, mainBlockFilmsComponent) => {
  render(mainBlockContent, mainBlockFilmsComponent);
};

const renderAllFilmsBlock = (mainBlockFilmsComponent, filmsAllComponent) => {
  render(mainBlockFilmsComponent.getElement(), filmsAllComponent);
};
const renderTopFilmsBlock = (mainBlockFilmsComponent, filmsListTopComponent) => {
  render(mainBlockFilmsComponent.getElement(), filmsListTopComponent);
};
const renderMostCommentFilmsBlock = (mainBlockFilmsComponent, filmsMostCommentComponent) => {
  render(mainBlockFilmsComponent.getElement(), filmsMostCommentComponent);
};

const renderFilmCards = (filmCards, filmsList, onDataChange, onViewChange) => {
  return filmCards.map((film) => {
    const filmController = new FilmController(filmsList, onDataChange, onViewChange);

    filmController.render(film);
    return filmController;
  });
};

const getFilmsTopRated = (films, count) => {
  const filmsSort = films.slice().sort((filmCurrent, filmNext) => {
    return Number(filmNext.filmInfo.totalRating) - Number(filmCurrent.filmInfo.totalRating);
  }).slice(0, count);

  const isNoEmpty = filmsSort.findIndex((film) => {
    return film.filmInfo.totalRating !== 0;
  });

  if (isNoEmpty !== -1) {
    return filmsSort;
  }

  return false;
};
const getFilmsMostCommented = (films, count) => {
  const filmsSort = films.slice().sort((filmCurrent, filmNext) => {
    return filmNext.comments.length - filmCurrent.comments.length;
  }).slice(0, count);

  const isNoEmpty = filmsSort.findIndex((film) => film.comments.length !== 0);

  if (isNoEmpty !== -1) {
    return filmsSort;
  }

  return false;
};

export default class Page {
  constructor(container, filmsModel) {
    this._container = container;
    this._films = null;
    this._filmsModel = filmsModel;
    this._activeFilter = FilterType.ALL;
    this._startShowCardsLoad = 0;

    this._showingFilmControllers = [];

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onCommentChange = this._onCommentChange.bind(this);
    this._onButtonShowMoreClick = this._onButtonShowMoreClick.bind(this);

    this._filmsModel.setDataChangeHandler(this._onCommentChange);
    this._filmsModel.setFilterChangeHandler(this._onFilterChange);

    this._sortsComponent = new SortsComponent(sorts);
    this._filmsBlockComponent = new MainBlockFilmsComponent();
    this._filmsAllComponent = new FilmsAllComponent();
    this._filmsTopComponent = new FilmsTopComponent();
    this._filmsMostCommentComponent = new FilmsMostCommentComponent();
    this._buttonShowMoreComponent = new MoreButtonFilmsComponent();

    this._filmListMain = this._filmsAllComponent.getContainer();
    this._filmListTop = this._filmsTopComponent.getContainer();
    this._filmListMostComment = this._filmsMostCommentComponent.getElement().getContainer();
  }

  render() {
    this._films = this._filmsModel.getFilms(this._activeFilter);
    this._filmsDefault = this._films.slice();

    render(this._container, this._sortsComponent);

    this._sortsComponent.setSortButtonClickHandler((evt) => {
      if (!evt.target.classList.contains(`sort__button--active`)) {
        const sortName = evt.target.dataset.sortName;
        this._films = sortingFilms(this._films, this._filmsDefault, sortName);
        this._sortsComponent.removeActiveButton();
        evt.target.classList.add(`sort__button--active`);
        this._removeFilms();
        this._startShowCardsLoad = 0;
        this._showingFilmControllers = renderMainFilmCards(this._films, this._filmListMain, this._startShowCardsLoad,
            this._onDataChange, this._onViewChange);
        this._startShowCardsLoad += FILMS_NUMBER_COUNT;
        this._buttonShowMore();
      }
    });

    renderMainBlockForFilms(this._container, this._filmsBlockComponent);
    if (!this._films.length) {
      render(this._filmsBlockComponent.getElement(), new NoFilmsComponent());
      return;
    }

    const filmRatedCards = getFilmsTopRated(this._films, FILMS_TOP_RATED);
    const filmMostCommentedCards = getFilmsMostCommented(this._films, FILMS_MOST_COMMENTED);

    renderAllFilmsBlock(this._filmsBlockComponent, this._filmsAllComponent);
    this._showingFilmControllers = renderMainFilmCards(this._films, this._filmListMain, this._startShowCardsLoad,
        this._onDataChange, this._onViewChange);

    if (filmRatedCards) {
      renderTopFilmsBlock(this._filmsBlockComponent, this._filmsTopComponent);
      renderTopFilmCards(filmRatedCards, this._filmListTop, this._onDataChange, this._onViewChange);
    }
    if (filmMostCommentedCards) {
      renderMostCommentFilmsBlock(this._filmsBlockComponent, this._filmsMostCommentComponent);
      renderMostCommentListCards(filmMostCommentedCards, this._filmListMostComment, this._onDataChange,
          this._onViewChange);
      this._buttonShowMore();
    }

    this._startShowCardsLoad += FILMS_NUMBER_COUNT;
  }

  show() {
    this._filmsBlockComponent.show();
    this._sortsComponent.show();
  }

  hide() {
    this._filmsBlockComponent.hide();
    this._sortsComponent.hide();
  }

  disableFormsFilms() {
    this._showingFilmControllers.forEach((filmController) => {
      filmController.disabledForm();
    });
  }

  activeFormsFilms() {
    this._showingFilmControllers.forEach((filmController) => {
      filmController.activeForm();
    });
  }

  _buttonShowMore() {
    remove(this._buttonShowMoreComponent);
    if (this._films.length <= FILMS_NUMBER_COUNT) {
      return;
    }
    renderShowMoreButton(this._filmsAllComponent, this._buttonShowMoreComponent);
    this._buttonShowMoreComponent.setClickHandler(this._onButtonShowMoreClick);
  }

  _removeFilms() {
    this._showingFilmControllers.forEach((filmController) => filmController.destroy());
    this._showingFilmControllers = [];
  }

  _updateFilms() {
    this._removeFilms();
    this._showingFilmControllers = renderFilmCards(
        this._films.slice(0, FILMS_NUMBER_COUNT),
        this._filmListMain,
        this._onDataChange,
        this._onViewChange
    );
  }

  _onButtonShowMoreClick() {
    const newFilms = renderMainFilmCards(this._films,
        this._filmListMain,
        this._startShowCardsLoad,
        this._onDataChange,
        this._onViewChange,
        this._onCommentChange,
        this._filmsModel
    );
    this._showingFilmControllers = this._showingFilmControllers.concat(newFilms);
    this._startShowCardsLoad += FILMS_NUMBER_COUNT;
    if (this._startShowCardsLoad >= this._films.length) {
      this._buttonShowMoreComponent.removeClickHandler(this._onButtonShowMoreClick);
      remove(this._buttonShowMoreComponent);
    }
  }

  _onDataChange(filmController, id, newDataFilm) {
    apiWithProvider.updateFilm(id, newDataFilm)
      .then((films) => {
        this._filmsModel.updateFilm(id, films);

        const isSuccess = this._filmsModel.updateFilm(id, newDataFilm);

        if (isSuccess) {
          filmController.render(newDataFilm);
        }
      });
  }

  _onCommentChange(idFilm, idComment, newComment) {
    if (newComment === null) {
      this._filmsModel.removeComment(idFilm, idComment);
    }

    if (idComment === null) {
      this._filmsModel.addComment(idFilm, newComment);
    }
  }

  _onViewChange() {
    this._showingFilmControllers.forEach((film) => film.setDefaultView());
  }

  _onFilterChange() {
    this._films = this._filmsModel.getFilms(this._filmsModel.getFilter());
    this._filmsDefault = this._films.slice();
    this._startShowCardsLoad = FILMS_NUMBER_COUNT;
    this._sortsComponent.reset();
    this._updateFilms();
    this._buttonShowMore();
  }
}

