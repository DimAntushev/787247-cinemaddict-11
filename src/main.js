import {render} from './utils/render.js';

import UserProfileComponent from './components/user-profile.js';
import TotalNumbersFilmsComponent from './components/total-number-films.js';

import FilmsModel from './models/films.js';
import PageController from './controllers/page.js';

import {generateFilms} from './mocks/film-card.js';
import {generateFilters} from './mocks/filters.js';

const FILMS_NUMBER_IN_MAIN_LIST = 20;

const mainHeader = document.querySelector(`.header`);
const mainBlock = document.querySelector(`.main`);

const films = generateFilms(FILMS_NUMBER_IN_MAIN_LIST);
const filters = generateFilters(films);

const filmsModel = new FilmsModel(films);

const renderHeader = (mainHeaderBlock) => {
  render(mainHeaderBlock, new UserProfileComponent());
};

const pageController = new PageController(mainBlock, filmsModel);

const renderFooter = (totalFilms, footerStatistics) => {
  render(footerStatistics, new TotalNumbersFilmsComponent(totalFilms));
};

const init = () => {
  renderHeader(mainHeader);

  pageController.render(films);

  const footerStatistics = document.querySelector(`.footer__statistics`);
  renderFooter(FILMS_NUMBER_IN_MAIN_LIST, footerStatistics);
};

init();
