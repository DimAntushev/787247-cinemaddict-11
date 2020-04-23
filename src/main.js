import {siteUserProfile} from './components/siteUserProfile.js';
import {siteMenu} from './components/siteMenu.js';
import {siteSort} from './components/siteSort.js';
import {siteFilmsMainBlocks} from './components/siteFilmsMainBlocks.js';
import {siteShowMoreButton} from './components/siteShowMoreButton.js';
import {siteFilmCard} from './components/siteFilmCard.js';
import {siteTotalNumberFilms} from './components/siteTotalNumberFilms.js';
import {siteFilmDetailPopup} from './components/siteFilmDetailPopup.js';

const NUMBER_FILMS_IN_MAIN_LIST = 5;
const NUMBER_FILMS_IN_TOP = 2;
const NUMBER_FILMS_IN_MOST_COMMENT = 2;

const render = (container, markup, position = `beforeend`) => {
  container.insertAdjacentHTML(position, markup);
};

const renderHeader = (mainHeader) => {
  render(mainHeader, siteUserProfile());
};
const renderMainBlocks = (mainBlockContent) => {
  render(mainBlockContent, siteMenu());
  render(mainBlockContent, siteSort());
  render(mainBlockContent, siteFilmsMainBlocks());
};
const renderFilmCards = (filmList, numberCards) => {
  for (let i = 0; i < numberCards; i++) {
    render(filmList, siteFilmCard());
  }
};
const renderShowMoreButton = (filmListMain) => {
  render(filmListMain, siteShowMoreButton());
};
const renderFilmLists = (filmList, filmListTop, filmListMostComment) => {
  renderFilmCards(filmList, NUMBER_FILMS_IN_MAIN_LIST);
  renderFilmCards(filmListTop, NUMBER_FILMS_IN_TOP);
  renderFilmCards(filmListMostComment, NUMBER_FILMS_IN_MOST_COMMENT);
};
const renderFooter = (footerStatistics) => {
  render(footerStatistics, siteTotalNumberFilms());
};
const renderDetailPopup = (mainFooter) => {
  render(mainFooter, siteFilmDetailPopup(), `afterend`);
};

const init = () => {
  const mainBlock = document.querySelector(`.main`);
  const mainHeader = document.querySelector(`.header`);
  const mainFooter = document.querySelector(`.footer`);

  renderHeader(mainHeader);

  renderMainBlocks(mainBlock);
  const filmListMain = mainBlock.querySelector(`.films-list`);
  renderShowMoreButton(filmListMain);
  const filmList = filmListMain.querySelector(`.films-list__container`);
  const filmsListAdditional = mainBlock.querySelectorAll(`.films-list--extra`);
  const filmListTop = filmsListAdditional[0].querySelector(`.films-list__container`);
  const filmListMostComment = filmsListAdditional[1].querySelector(`.films-list__container`);
  renderFilmLists(filmList, filmListTop, filmListMostComment);
  const footerStatistics = document.querySelector(`.footer__statistics`);

  renderFooter(footerStatistics);

  renderDetailPopup(mainFooter);
};
init();

// Дополнительные функционал для скрытия попапа

const popupDetail = document.querySelector(`.film-details`);
const popupDetailClose = popupDetail.querySelector(`.film-details__close-btn`);

const onButtonCloseClick = () => {
  popupDetail.classList.add(`visually-hidden`);
  popupDetailClose.removeEventListener(`click`, onButtonCloseClick);
};

popupDetailClose.addEventListener(`click`, onButtonCloseClick);
