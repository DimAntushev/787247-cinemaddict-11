import {createFiltersTemplate} from './components/filters.js';
import {generateFilters} from './mocks/filters.js';

import {createUserProfileTemplate} from './components/user-profile.js';

import {createSortsTemplate} from './components/sorts.js';
import {sorts} from './mocks/sorts.js';

import {createFilmCard} from './components/film-card.js';
import {generateFilms} from './mocks/film-card.js';

import {createMainBlockFilmsTemplate} from './components/main-block-films.js';
import {createAllFilmsTemplate} from './components/films-all.js';
import {createTopFilmsTemplate} from './components/films-top.js';
import {createMostCommentFilmsTemplate} from './components/films-most-comment.js';
import {createMoreButtonTemplate} from './components/more-button.js';

import {createTotalNumbersFilmsTemplate} from './components/total-number-films.js';
import {createPopupDetailFilmTemplate} from './components/popup-detail-film.js';

const FILMS_NUMBER_IN_MAIN_LIST = 17;
const FILMS_NUMBER_COUNT = 5;
const FILMS_TOP_RATED = 2;
const FILMS_MOST_COMMENTED = 2;
let startShowCardsLoad = 0;

const films = generateFilms(FILMS_NUMBER_IN_MAIN_LIST);
const filters = generateFilters(films);

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

const render = (container, markup, position = `beforeend`) => {
  container.insertAdjacentHTML(position, markup);
};

const renderHeader = (mainHeader) => {
  render(mainHeader, createUserProfileTemplate());
};
const renderFilters = (allFilters, mainBlockContent) => {
  render(mainBlockContent, createFiltersTemplate(allFilters));
};
const renderSorts = (allSorts, mainBlockContent) => {
  render(mainBlockContent, createSortsTemplate(allSorts));
};
const renderMainBlocks = (mainBlockContent) => {
  render(mainBlockContent, createMainBlockFilmsTemplate());
};
const renderAllFilmsBlock = (mainBlockFilms) => {
  render(mainBlockFilms, createAllFilmsTemplate());
};
const renderTopFilmsBlock = (mainBlockFilms) => {
  render(mainBlockFilms, createTopFilmsTemplate());
};
const renderMostCommentFilmsBlock = (mainBlockFilms) => {
  render(mainBlockFilms, createMostCommentFilmsTemplate());
};
const renderFilmCards = (filmCards, filmList) => {
  filmCards.forEach((film) => {
    render(filmList, createFilmCard(film));
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
  render(filmListMain, createMoreButtonTemplate());
};
const renderFooter = (totalFilms, footerStatistics) => {
  render(footerStatistics, createTotalNumbersFilmsTemplate(totalFilms));
};
const renderDetailPopup = (film, mainFooter) => {
  render(mainFooter, createPopupDetailFilmTemplate(film), `afterend`);
};

const init = () => {
  const mainBlock = document.querySelector(`.main`);
  const mainHeader = document.querySelector(`.header`);
  const mainFooter = document.querySelector(`.footer`);

  renderHeader(mainHeader);

  renderFilters(filters, mainBlock);
  renderSorts(sorts, mainBlock);
  renderMainBlocks(mainBlock);

  const mainFilmsBlock = mainBlock.querySelector(`.films`);
  renderAllFilmsBlock(mainFilmsBlock);
  renderTopFilmsBlock(mainFilmsBlock);
  renderMostCommentFilmsBlock(mainFilmsBlock);

  const filmListMain = mainBlock.querySelector(`.films-list`);
  renderShowMoreButton(filmListMain);
  const buttonShowMore = filmListMain.querySelector(`.films-list__show-more`);


  const filmList = filmListMain.querySelector(`.films-list__container`);
  const filmsListAdditional = mainBlock.querySelectorAll(`.films-list--extra`);
  const filmListTop = filmsListAdditional[0].querySelector(`.films-list__container`);
  const filmListMostComment = filmsListAdditional[1].querySelector(`.films-list__container`);
  renderMainFilmCards(films, filmList);
  renderTopFilmCards(filmsRated, filmListTop);
  renderMostCommentListCards(filmsMostCommented, filmListMostComment);

  const footerStatistics = document.querySelector(`.footer__statistics`);
  renderFooter(FILMS_NUMBER_IN_MAIN_LIST, footerStatistics);

  renderDetailPopup(films[0], mainFooter);

  const onButtonShowMoreClick = () => {
    renderMainFilmCards(films, filmList);

    if (startShowCardsLoad >= FILMS_NUMBER_IN_MAIN_LIST) {
      removeEventListener(`click`, buttonShowMore);
      buttonShowMore.remove();
    }
  };
  buttonShowMore.addEventListener(`click`, onButtonShowMoreClick);
};

init();

// Функционал для открытия и скрытия подробной информации о фильме

const popupDetail = document.querySelector(`.film-details`);
const popupDetailClose = popupDetail.querySelector(`.film-details__close-btn`);
popupDetail.classList.add(`visually-hidden`);

const onButtonCloseClick = () => {
  popupDetail.classList.add(`visually-hidden`);
  popupDetailClose.removeEventListener(`click`, onButtonCloseClick);
};

popupDetailClose.addEventListener(`click`, onButtonCloseClick);
