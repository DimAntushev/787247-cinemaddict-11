import {render, remove} from './utils/render.js';

import UserProfileComponent from './components/user-profile.js';
import TotalNumbersFilmsComponent from './components/total-number-films.js';
import LoadComponent from './components/loading.js';

import FilmsModel from './models/films.js';
import CommentsModel from './models/comments.js';
import PageController from './controllers/page.js';
import FiltersController from './controllers/filters.js';
import StatsController from './controllers/stats.js';

import API from './api/index.js';
import Store from './api/store.js';
import Provider from './api/provider.js';
import {RenderPosition} from "./utils/render";

const AUTHORIZATION_TOKEN = `Basic uivevinreow=`;
const END_POINT = `https://11.ecmascript.pages.academy/cinemaddict`;
const STORE_FILMS_PREFIX = `cinemaddict-localstorage-films`;
const STORE_FILMS_VER = `v1`;
const STORE_FILMS_NAME = `${STORE_FILMS_PREFIX}-${STORE_FILMS_VER}`;
const TITLE_TEXT_OFFLINE = ` [offline]`;

const STORE_COMMENTS_PREFIX = `cinemaddict-localstorage-comments`;
const STORE_COMMENTS_VER = `v1`;
const STORE_COMMENTS_NAME = `${STORE_COMMENTS_PREFIX}-${STORE_COMMENTS_VER}`;

const api = new API(AUTHORIZATION_TOKEN, END_POINT);
const storeFilms = new Store(STORE_FILMS_NAME, window.localStorage);
const storeComments = new Store(STORE_COMMENTS_NAME, window.localStorage);
const apiWithProvider = new Provider(api, storeFilms, storeComments);
const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();
const loadComponent = new LoadComponent();

const mainHeaderElement = document.querySelector(`.header`);
const mainBlockElement = document.querySelector(`.main`);

const renderHeader = (mainHeaderBlock, filmsCount) => {
  render(mainHeaderBlock, new UserProfileComponent(filmsCount));
};
const renderFooter = (totalFilms, footerStatistics) => {
  render(footerStatistics, new TotalNumbersFilmsComponent(totalFilms));
};

const loadComment = (idFilm) => {
  return apiWithProvider.getComments(idFilm)
    .then((comments) => {
      return {
        comments,
        idFilmComments: idFilm
      };
    });
};

const pageController = new PageController(mainBlockElement, filmsModel, apiWithProvider);
const filtersController = new FiltersController(mainBlockElement, filmsModel);
const statsController = new StatsController(mainBlockElement, filmsModel);

const init = () => {
  render(mainBlockElement, loadComponent, RenderPosition.AFTERBEGIN);
  apiWithProvider.getFilms()
    .then((films) => {
      const filmsCount = films.filter((filmFilter) => filmFilter.userDetails.alreadyWatched).length;
      renderHeader(mainHeaderElement, filmsCount);
      remove(loadComponent);
      filmsModel.setFilms(films);
      return films.map((film) => {
        return loadComment(film.id);
      });
    })
    .then((commentsPromises) => {
      return Promise.all(commentsPromises);
    })
    .then((comments) => {
      commentsModel.setComments(comments);
      const films = filmsModel.getFilmsAll();
      filtersController.render();
      pageController.render();
      pageController.hide();
      statsController.render(films, filmsModel);
      const footerStatisticsElement = document.querySelector(`.footer__statistics`);
      renderFooter(films.length, footerStatisticsElement);
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
  document.title = document.title.replace(TITLE_TEXT_OFFLINE, ``);
  pageController.activeFormsFilms();

  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += TITLE_TEXT_OFFLINE;
  pageController.disableFormsFilms();
});

export {pageController, statsController, filmsModel, commentsModel, apiWithProvider};
