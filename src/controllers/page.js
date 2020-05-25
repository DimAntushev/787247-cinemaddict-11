import {remove, render, RenderPosition} from '../utils/render';
import NoFilmsComponent from '../components/index-no-data';
import FilmCardComponent from '../components/film-card';
import PopupDetailFilmComponent from '../components/popup-detail-film';
import MoreButtonFilmsComponent from '../components/more-button';
import MainBlockFilmsComponent from '../components/main-block-films';
import FilmsAllComponent from '../components/films-all';
import FilmsTopComponent from '../components/films-top';
import FilmsMostCommentComponent from '../components/films-most-comment';
import FiltersComponent from '../components/filters';
import SortsComponent from '../components/sorts';

import {SortType} from '../mocks/sorts.js';

const FILMS_NUMBER_COUNT = 5;
const FILMS_TOP_RATED = 2;
const FILMS_MOST_COMMENTED = 2;

const sortingDateFilms = (films) => {
  return films.slice().sort((filmCurrent, filmNext) => {
    return filmCurrent.filmInfo.release.date - filmNext.filmInfo.release.date;
  });
};
const sortingRatingFilms = (films) => {
  return films.slice().sort((filmCurrent, filmNext) => {
    return filmCurrent.filmInfo.totalRating - filmNext.filmInfo.totalRating;
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

const renderMainFilmCards = (filmCards, filmList, startShowCardsLoad) => {
  const filmsCardsLoad = filmCards.slice(startShowCardsLoad, startShowCardsLoad + FILMS_NUMBER_COUNT);
  renderFilmCards(filmsCardsLoad, filmList);

  startShowCardsLoad += FILMS_NUMBER_COUNT;

  return startShowCardsLoad;
};
const renderTopFilmCards = (filmCards, filmList) => {
  renderFilmCards(filmCards, filmList);
};
const renderMostCommentListCards = (filmCards, filmList) => {
  renderFilmCards(filmCards, filmList);
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

const renderFilmCards = (filmCards, filmsList) => {
  filmCards.forEach((film) => {
    renderFilm(film, filmsList);
  });
};

const renderFilm = (film, filmsList) => {
  const mainFooter = document.querySelector(`.footer`);
  const filmCardComponent = new FilmCardComponent(film);
  const popupDetailFilmComponent = new PopupDetailFilmComponent(film);

  const showPopupFilm = () => {
    render(mainFooter, popupDetailFilmComponent, RenderPosition.AFTEREND);
  };
  const closePopupFilm = () => {
    remove(popupDetailFilmComponent);
  };

  const addListenerOpenOnElementsFilmCard = () => {
    filmCardComponent.setTitleClickHandler(onTitleFilmClick);
    filmCardComponent.setPosterClickHandler(onPosterFilmClick);
    filmCardComponent.setCommentsClickHandler(onCommentsFilmClick);

    document.removeEventListener(`keydown`, onEscapeClosePopupDown);
  };
  const addListenerCloseOnElementsFilmCard = () => {
    popupDetailFilmComponent.setCloseClickHandler(onButtonClosePopupFilmDetail);
    document.addEventListener(`keydown`, onEscapeClosePopupDown);
  };

  const onTitleFilmClick = () => {
    showPopupFilm();

    addListenerCloseOnElementsFilmCard();

    filmCardComponent.removeTitleClickHandler(onPosterFilmClick);
    filmCardComponent.removePosterClickHandler(`click`, onCommentsFilmClick);
  };
  const onPosterFilmClick = () => {
    showPopupFilm();

    addListenerCloseOnElementsFilmCard();

    filmCardComponent.removeTitleClickHandler(onTitleFilmClick);
    filmCardComponent.removeCommentsClickHandler(onCommentsFilmClick);
  };
  const onCommentsFilmClick = () => {
    showPopupFilm();

    addListenerCloseOnElementsFilmCard();

    filmCardComponent.removeTitleClickHandler(onTitleFilmClick);
    filmCardComponent.removePosterClickHandler(onPosterFilmClick);
  };
  const onButtonClosePopupFilmDetail = () => {
    closePopupFilm();

    addListenerOpenOnElementsFilmCard();

    popupDetailFilmComponent.removeCloseClickHandler(onButtonClosePopupFilmDetail);
  };
  const onEscapeClosePopupDown = (evt) => {
    const isEscape = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscape) {
      closePopupFilm();

      addListenerOpenOnElementsFilmCard();
    }
  };

  addListenerOpenOnElementsFilmCard();

  render(filmsList, filmCardComponent);
};

const getFilmsTopRated = (films, count) => {
  return films.slice().sort((filmCurrent, filmNext) => {
    return Number(filmNext.filmInfo.totalRating) - Number(filmCurrent.filmInfo.totalRating);
  }).slice(0, count);
};
const getFilmsMostCommented = (films, count) => {
  return films.slice().sort((filmCurrent, filmNext) => {
    return filmNext.comments.length - filmCurrent.comments.length;
  }).slice(0, count);
};

export default class Page {
  constructor(container, films, filters, sorts) {
    this._container = container;
    this._films = films;
    this._filmsDefault = films.slice();
    this._startShowCardsLoad = 0;

    this._filmListMain = null;
    this._filmListTop = null;
    this._filmListMostComment = null;

    this._filtersComponent = new FiltersComponent(filters);
    this._sortsComponent = new SortsComponent(sorts);
    this._filmsBlockComponent = new MainBlockFilmsComponent();
    this._filmsAllComponent = new FilmsAllComponent();
    this._filmsTopComponent = new FilmsTopComponent();
    this._filmsMostCommentComponent = new FilmsMostCommentComponent();
    this._buttonShowMoreComponent = new MoreButtonFilmsComponent();
  }

  render() {
    render(this._container, this._filtersComponent);
    render(this._container, this._sortsComponent);

    this._sortsComponent.setSortButtonClickHandler((evt) => {
      if (!evt.target.classList.contains(`sort__button--active`)) {
        const sortName = evt.target.dataset.sortName;
        this._startShowCardsLoad = 0;

        this._films = sortingFilms(this._films, this._filmsDefault, sortName);

        this._sortsComponent.removeActiveButton();
        evt.target.classList.add(`sort__button--active`);
        this._filmListMain.innerHTML = ``;
        this._startShowCardsLoad = renderMainFilmCards(this._films, this._filmListMain, this._startShowCardsLoad);
      }
    });

    if (!this._films.length) {
      const mainBlockForFilmsComponent = renderMainBlockForFilms(this._container);
      render(mainBlockForFilmsComponent.getElement(), new NoFilmsComponent().getElement());
      return;
    }

    renderMainBlockForFilms(this._container, this._filmsBlockComponent);
    renderAllFilmsBlock(this._filmsBlockComponent, this._filmsAllComponent);
    renderTopFilmsBlock(this._filmsBlockComponent, this._filmsTopComponent);
    renderMostCommentFilmsBlock(this._filmsBlockComponent, this._filmsMostCommentComponent);

    renderShowMoreButton(this._filmsAllComponent, this._buttonShowMoreComponent);

    const filmRatedCards = getFilmsTopRated(this._films, FILMS_TOP_RATED);
    const filmMostCommentedCards = getFilmsMostCommented(this._films, FILMS_MOST_COMMENTED);

    this._filmListMain = this._filmsAllComponent.getElement().querySelector(`.films-list__container`);
    this._filmListTop = this._filmsTopComponent.getElement().querySelector(`.films-list__container`);
    this._filmListMostComment = this._filmsMostCommentComponent.getElement()
      .querySelector(`.films-list__container`);
    this._startShowCardsLoad = renderMainFilmCards(this._films, this._filmListMain, this._startShowCardsLoad);
    renderTopFilmCards(filmRatedCards, this._filmListTop);
    renderMostCommentListCards(filmMostCommentedCards, this._filmListMostComment);

    const onButtonShowMoreClick = () => {
      this._startShowCardsLoad = renderMainFilmCards(this._films, this._filmListMain, this._startShowCardsLoad);

      if (this._startShowCardsLoad >= this._films.length) {
        this._buttonShowMoreComponent.removeClickHandler(onButtonShowMoreClick);
        remove(this._buttonShowMoreComponent);
      }
    };
    this._buttonShowMoreComponent.setClickHandler(onButtonShowMoreClick);
  }
}
