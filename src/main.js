import {render} from './utils.js';

import UserProfileComponent from './components/user-profile.js';
import FiltersComponent from './components/filters.js';
import SortsComponent from './components/sorts.js';

import MainBlockFilmsComponent from './components/main-block-films.js';
import FilmsAllComponent from './components/films-all.js';
import FilmsTopComponent from './components/films-top.js';
import FilmsMostCommentComponent from './components/films-most-comment.js';
import NoFilmsComponent from './components/index-no-data.js';

import FilmCardComponent from './components/film-card.js';

import MoreButtonFilmsComponent from './components/more-button.js';
import TotalNumbersFilmsComponent from './components/total-number-films.js';
import PopupDetailFilmComponent from './components/popup-detail-film.js';

import {generateFilms} from './mocks/film-card.js';
import {generateFilters} from './mocks/filters.js';
import {sorts} from './mocks/sorts.js';

const FILMS_NUMBER_IN_MAIN_LIST = 10;
const FILMS_NUMBER_COUNT = 5;
const FILMS_TOP_RATED = 2;
const FILMS_MOST_COMMENTED = 2;
let startShowCardsLoad = 0;

const films = generateFilms(FILMS_NUMBER_IN_MAIN_LIST);
const filters = generateFilters(films);

const renderHeader = (mainHeader) => {
  render(mainHeader, new UserProfileComponent().getElement());
};
const renderFilters = (allFilters, mainBlockContent) => {
  render(mainBlockContent, new FiltersComponent(filters).getElement());
};
const renderSorts = (allSorts, mainBlockContent) => {
  render(mainBlockContent, new SortsComponent(sorts).getElement());
};
const renderFilterAndSortSections = (mainBlockContent, allFilters, allSorts) => {
  renderFilters(allFilters, mainBlockContent);
  renderSorts(allSorts, mainBlockContent);
};
const renderMainBlockForFilms = (mainBlockContent) => {
  const mainBlockFilmsComponent = new MainBlockFilmsComponent();
  render(mainBlockContent, mainBlockFilmsComponent.getElement());

  return mainBlockFilmsComponent;
};

const renderAllFilmsBlock = (mainBlockFilms) => {
  render(mainBlockFilms, new FilmsAllComponent().getElement());
};
const renderTopFilmsBlock = (mainBlockFilms) => {
  render(mainBlockFilms, new FilmsTopComponent().getElement());
};
const renderMostCommentFilmsBlock = (mainBlockFilms) => {
  render(mainBlockFilms, new FilmsMostCommentComponent().getElement());
};

const renderFilmCards = (filmCards, filmsList) => {
  filmCards.forEach((film) => {
    renderFilm(film, filmsList);
  });
};
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
  render(filmListMain, new MoreButtonFilmsComponent().getElement());
};
const renderFooter = (totalFilms, footerStatistics) => {
  render(footerStatistics, new TotalNumbersFilmsComponent(totalFilms).getElement());
};

const renderFilmsSection = (mainBlock) => {
  if (films.length === 0) {
    renderFilterAndSortSections(mainBlock, filters, sorts);
    const mainBlockForFilmsComponent = renderMainBlockForFilms(mainBlock);
    render(mainBlockForFilmsComponent.getElement(), new NoFilmsComponent().getElement());
    return;
  }

  renderFilterAndSortSections(mainBlock, filters, sorts);
  renderMainBlockForFilms(mainBlock);

  const filmsBlock = mainBlock.querySelector(`.films`);
  renderAllFilmsBlock(filmsBlock);
  renderTopFilmsBlock(filmsBlock);
  renderMostCommentFilmsBlock(filmsBlock);

  const filmListMain = mainBlock.querySelector(`.films-list`);
  renderShowMoreButton(filmListMain);
  const filmList = filmListMain.querySelector(`.films-list__container`);

  const getFilmsTopRated = (allFilms, count) => {
    return films.slice().sort((filmCurrent, filmNext) => {
      return Number(filmNext.filmInfo.totalRating) - Number(filmCurrent.filmInfo.totalRating);
    }).slice(0, count);
  };
  const filmsRated = getFilmsTopRated(films, FILMS_TOP_RATED);
  const getFilmsMostCommented = (allFilms, count) => {
    return films.slice().sort((filmCurrent, filmNext) => {
      return filmNext.comments.length - filmCurrent.comments.length;
    }).slice(0, count);
  };
  const filmsMostCommented = getFilmsMostCommented(films, FILMS_MOST_COMMENTED);
  const filmsListAdditional = mainBlock.querySelectorAll(`.films-list--extra`);
  const filmListTop = filmsListAdditional[0].querySelector(`.films-list__container`);
  const filmListMostComment = filmsListAdditional[1].querySelector(`.films-list__container`);
  renderMainFilmCards(films, filmList);
  renderTopFilmCards(filmsRated, filmListTop);
  renderMostCommentListCards(filmsMostCommented, filmListMostComment);

  const buttonShowMore = filmListMain.querySelector(`.films-list__show-more`);
  const onButtonShowMoreClick = () => {
    renderMainFilmCards(films, filmList);

    if (startShowCardsLoad >= FILMS_NUMBER_IN_MAIN_LIST) {
      removeEventListener(`click`, buttonShowMore);
      buttonShowMore.remove();
    }
  };
  buttonShowMore.addEventListener(`click`, onButtonShowMoreClick);
};
const renderFilm = (film, filmsList) => {
  const mainFooter = document.querySelector(`.footer`);
  const filmCardComponent = new FilmCardComponent(film);
  const popupDetailFilmComponent = new PopupDetailFilmComponent(film);
  const filmTitle = filmCardComponent.getElement().querySelector(`.film-card__title`);
  const filmPoster = filmCardComponent.getElement().querySelector(`.film-card__poster`);
  const filmComments = filmCardComponent.getElement().querySelector(`.film-card__comments`);
  const filmCloseButton = popupDetailFilmComponent.getElement().querySelector(`.film-details__close-btn`);

  const showPopupFilm = () => {
    mainFooter.append(popupDetailFilmComponent.getElement());
  };
  const closePopupFilm = () => {
    popupDetailFilmComponent.getElement().remove();
  };

  const addListenerOpenOnElementsFilmCard = () => {
    filmTitle.addEventListener(`click`, onTitleFilmClick);
    filmPoster.addEventListener(`click`, onPosterFilmClick);
    filmComments.addEventListener(`click`, onCommentsFilmClick);
  };
  const addListenerCloseOnElementsFilmCard = () => {
    filmCloseButton.addEventListener(`click`, onButtonClosePopupFilmDetail);
    document.addEventListener(`keydown`, onEscapeClosePopupDown);
  };

  const onTitleFilmClick = () => {
    showPopupFilm();

    addListenerCloseOnElementsFilmCard();

    filmPoster.removeEventListener(`click`, onPosterFilmClick);
    filmComments.removeEventListener(`click`, onCommentsFilmClick);
  };
  const onPosterFilmClick = () => {
    showPopupFilm();

    addListenerCloseOnElementsFilmCard();

    filmTitle.removeEventListener(`click`, onTitleFilmClick);
    filmComments.removeEventListener(`click`, onCommentsFilmClick);
  };
  const onCommentsFilmClick = () => {
    showPopupFilm();

    addListenerCloseOnElementsFilmCard();

    filmTitle.removeEventListener(`click`, onTitleFilmClick);
    filmPoster.removeEventListener(`click`, onPosterFilmClick);
  };
  const onButtonClosePopupFilmDetail = () => {
    closePopupFilm();

    addListenerOpenOnElementsFilmCard();

    filmCloseButton.removeEventListener(`click`, onButtonClosePopupFilmDetail);
  };
  const onEscapeClosePopupDown = (evt) => {
    const isEscape = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscape) {
      closePopupFilm();

      addListenerOpenOnElementsFilmCard();
    }
  };

  addListenerOpenOnElementsFilmCard();

  render(filmsList, filmCardComponent.getElement());
};

const init = () => {
  const mainHeader = document.querySelector(`.header`);
  const mainBlock = document.querySelector(`.main`);
  const footerStatistics = document.querySelector(`.footer__statistics`);

  renderHeader(mainHeader);

  renderFilmsSection(mainBlock);

  renderFooter(FILMS_NUMBER_IN_MAIN_LIST, footerStatistics);
};

init();
