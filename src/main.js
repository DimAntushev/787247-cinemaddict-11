import {render} from './utils/render.js';

import UserProfileComponent from './components/user-profile.js';
import FiltersComponent from './components/filters.js';
import SortsComponent from './components/sorts.js';
import TotalNumbersFilmsComponent from './components/total-number-films.js';

import PageController from './controllers/page-controller.js';

import {generateFilms} from './mocks/film-card.js';
import {generateFilters} from './mocks/filters.js';
import {sorts} from './mocks/sorts.js';

const FILMS_NUMBER_IN_MAIN_LIST = 20;

const mainHeader = document.querySelector(`.header`);
const mainBlock = document.querySelector(`.main`);

const films = generateFilms(FILMS_NUMBER_IN_MAIN_LIST);
const filters = generateFilters(films);

const renderHeader = (mainHeaderBlock) => {
  render(mainHeaderBlock, new UserProfileComponent());
};

const renderFilters = (allFilters, mainBlockContent) => {
  render(mainBlockContent, new FiltersComponent(allFilters));
};
const renderSorts = (allSorts, mainBlockContent) => {
  render(mainBlockContent, new SortsComponent(sorts));
};
const renderFilterAndSortSections = (mainBlockContent, allFilters, allSorts) => {
  renderFilters(allFilters, mainBlockContent);
  renderSorts(allSorts, mainBlockContent);
};

const pageController = new PageController(mainBlock);

const renderFooter = (totalFilms, footerStatistics) => {
  render(footerStatistics, new TotalNumbersFilmsComponent(totalFilms));
};

const init = () => {
  renderHeader(mainHeader);

  renderFilterAndSortSections(mainBlock, filters, sorts);

  pageController.render(films);

  const footerStatistics = document.querySelector(`.footer__statistics`);
  renderFooter(FILMS_NUMBER_IN_MAIN_LIST, footerStatistics);
};

init();
