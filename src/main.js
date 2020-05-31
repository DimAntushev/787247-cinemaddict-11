import {render} from './utils/render.js';

import UserProfileComponent from './components/user-profile.js';
import TotalNumbersFilmsComponent from './components/total-number-films.js';

import FilmsModel from './models/films.js';
import CommentsModel from './models/comments.js';
import PageController from './controllers/page.js';
import FiltersController from './controllers/filters.js';
import StatsController from './controllers/stats.js';

import API from './api.js';

const AUTHORIZATION_TOKEN = `Basic dXNlckBwYfXNzd9yZAo=`;
const END_POINT = `https://11.ecmascript.pages.academy/cinemaddict`;

const api = new API(AUTHORIZATION_TOKEN, END_POINT);
const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();

const mainHeader = document.querySelector(`.header`);
const mainBlock = document.querySelector(`.main`);

const renderHeader = (mainHeaderBlock, filmsCount) => {
  render(mainHeaderBlock, new UserProfileComponent(filmsCount));
};
const renderFooter = (totalFilms, footerStatistics) => {
  render(footerStatistics, new TotalNumbersFilmsComponent(totalFilms));
};



const pageController = new PageController(mainBlock, filmsModel, api);
const filtersController = new FiltersController(mainBlock, filmsModel);
const statsController = new StatsController(mainBlock, filmsModel);

const init = () => {
  api.getFilms()
    .then((films) => {
      const filmsCount = films.filter((film) => film.userDetails.alreadyWatched).length;
      renderHeader(mainHeader, filmsCount);
      filtersController.render();
      filmsModel.setFilms(films);
      pageController.render();
      pageController.hide();
      statsController.render(films);
      const footerStatistics = document.querySelector(`.footer__statistics`);
      renderFooter(films.length, footerStatistics);
    });
};

init();

export {pageController, statsController, filmsModel, commentsModel, api};
