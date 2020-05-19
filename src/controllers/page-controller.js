import {remove, render, RenderPosition} from "../utils/render";
import NoFilmsComponent from "../components/index-no-data";
import FilmCardComponent from "../components/film-card";
import PopupDetailFilmComponent from "../components/popup-detail-film";
import MoreButtonFilmsComponent from "../components/more-button";
import MainBlockFilmsComponent from "../components/main-block-films";
import FilmsAllComponent from "../components/films-all";
import FilmsTopComponent from "../components/films-top";
import FilmsMostCommentComponent from "../components/films-most-comment";

const FILMS_NUMBER_COUNT = 5;
const FILMS_TOP_RATED = 2;
const FILMS_MOST_COMMENTED = 2;
let startShowCardsLoad = 0;

const renderMainFilmCards = (filmCards, filmList) => {
  const filmsCardsLoad = filmCards.slice(startShowCardsLoad, startShowCardsLoad + FILMS_NUMBER_COUNT);
  renderFilmCards(filmsCardsLoad, filmList);

  startShowCardsLoad += FILMS_NUMBER_COUNT;
};
const renderTopFilmCards = (filmCards, filmList) => {
  renderFilmCards(filmCards, filmList);
};
const renderMostCommentListCards = (filmCards, filmList) => {
  renderFilmCards(filmCards, filmList);
};

const renderShowMoreButton = (filmListMain) => {
  const buttonShowMoreComponent = new MoreButtonFilmsComponent();

  render(filmListMain, buttonShowMoreComponent);

  return buttonShowMoreComponent;
};

const renderMainBlockForFilms = (mainBlockContent) => {
  const mainBlockFilmsComponent = new MainBlockFilmsComponent();

  render(mainBlockContent, mainBlockFilmsComponent);

  return mainBlockFilmsComponent;
};

const renderAllFilmsBlock = (mainBlockFilms) => {
  const filmsAllComponent = new FilmsAllComponent();

  render(mainBlockFilms, filmsAllComponent);

  return filmsAllComponent;
};
const renderTopFilmsBlock = (mainBlockFilms) => {
  const filmsListTopComponent = new FilmsTopComponent();

  render(mainBlockFilms, filmsListTopComponent);

  return filmsListTopComponent;
};
const renderMostCommentFilmsBlock = (mainBlockFilms) => {
  const filmsListMostCommentComponent = new FilmsMostCommentComponent();

  render(mainBlockFilms, filmsListMostCommentComponent);

  return filmsListMostCommentComponent;
};

const renderFilmCards = (filmCards, filmsList) => {
  filmCards.forEach((film) => {
    renderFilm(film, filmsList);
  });
};

const renderFilmsSection = (films, mainBlock) => {
  if (!films.length) {
    const mainBlockForFilmsComponent = renderMainBlockForFilms(mainBlock);
    render(mainBlockForFilmsComponent.getElement(), new NoFilmsComponent().getElement());
    return;
  }

  const filmsBlockComponent = renderMainBlockForFilms(mainBlock);
  const filmsListMainComponent = renderAllFilmsBlock(filmsBlockComponent.getElement());
  const filmsListTopComponent = renderTopFilmsBlock(filmsBlockComponent.getElement());
  const filmsListMostCommentComponent = renderMostCommentFilmsBlock(filmsBlockComponent.getElement());

  const buttonShowMoreComponent = renderShowMoreButton(filmsListMainComponent.getElement());

  const getFilmsTopRated = (allFilms, count) => {
    return films.slice().sort((filmCurrent, filmNext) => {
      return Number(filmNext.filmInfo.totalRating) - Number(filmCurrent.filmInfo.totalRating);
    }).slice(0, count);
  };
  const filmRatedCards = getFilmsTopRated(films, FILMS_TOP_RATED);
  const getFilmsMostCommented = (allFilms, count) => {
    return films.slice().sort((filmCurrent, filmNext) => {
      return filmNext.comments.length - filmCurrent.comments.length;
    }).slice(0, count);
  };
  const filmMostCommentedCards = getFilmsMostCommented(films, FILMS_MOST_COMMENTED);

  const filmListMain = filmsListMainComponent.getElement().querySelector(`.films-list__container`);
  const filmListTop = filmsListTopComponent.getElement().querySelector(`.films-list__container`);
  const filmListMostComment = filmsListMostCommentComponent.getElement()
    .querySelector(`.films-list__container`);
  renderMainFilmCards(films, filmListMain);
  renderTopFilmCards(filmRatedCards, filmListTop);
  renderMostCommentListCards(filmMostCommentedCards, filmListMostComment);

  const onButtonShowMoreClick = () => {
    renderMainFilmCards(films, filmListMain);

    if (startShowCardsLoad >= films.length) {
      buttonShowMoreComponent.removeClickHandler(`click`, onButtonShowMoreClick);
      remove(buttonShowMoreComponent);
    }
  };
  buttonShowMoreComponent.setClickHandler(onButtonShowMoreClick);
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

export default class PageController {
  constructor(container) {
    this._container = container;
  }

  render(filmCards) {
    renderFilmsSection(filmCards, this._container);
  }
}
