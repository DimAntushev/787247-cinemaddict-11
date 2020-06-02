import {render} from './utils/render.js';

import UserProfileComponent from './components/user-profile.js';
import TotalNumbersFilmsComponent from './components/total-number-films.js';

import FilmsModel from './models/films.js';
import CommentsModel from './models/comments.js';
import PageController from './controllers/page.js';
import FiltersController from './controllers/filters.js';
import StatsController from './controllers/stats.js';

import API from './api/index.js';
import Store from './api/store.js';
import Provider from './api/provider.js';

const AUTHORIZATION_TOKEN = `Basic sdvserverver=`;
const END_POINT = `https://11.ecmascript.pages.academy/cinemaddict`;
const STORE_FILMS_PREFIX = `cinemaddict-localstorage-films`;
const STORE_FILMS_VER = `v1`;
const STORE_FILMS_NAME = `${STORE_FILMS_PREFIX}-${STORE_FILMS_VER}`;

const STORE_COMMENTS_PREFIX = `cinemaddict-localstorage-comments`;
const STORE_COMMENTS_VER = `v1`;
const STORE_COMMENTS_NAME = `${STORE_COMMENTS_PREFIX}-${STORE_COMMENTS_VER}`;

const api = new API(AUTHORIZATION_TOKEN, END_POINT);
const storeFilms = new Store(STORE_FILMS_NAME, window.localStorage);
const storeComments = new Store(STORE_COMMENTS_NAME, window.localStorage);
const apiWithProvider = new Provider(api, storeFilms, storeComments);
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

const pageController = new PageController(mainBlock, filmsModel, apiWithProvider);
const filtersController = new FiltersController(mainBlock, filmsModel);
const statsController = new StatsController(mainBlock, filmsModel);

const init = () => {
  apiWithProvider.getFilms()
    .then((films) => {
      const filmsCount = films.filter((film) => film.userDetails.alreadyWatched).length;
      renderHeader(mainHeader, filmsCount);
      filtersController.render();
      filmsModel.setFilms(films);
      pageController.render();
      pageController.hide();
      statsController.render(films, filmsModel);
      const footerStatistics = document.querySelector(`.footer__statistics`);
      renderFooter(films.length, footerStatistics);
    });
};

init();

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`)
    .then(() => {

    }).catch(() => {

    });
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  pageController.activeFormsFilms();

  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
  pageController.disableFormsFilms();
});

export {pageController, statsController, filmsModel, commentsModel, apiWithProvider};
