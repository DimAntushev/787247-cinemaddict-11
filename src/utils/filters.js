import {FilterType} from './../const.js';

const getFilmsWatchlist = (films) => {
  return films.filter((film) => film.userDetails.watchlist);
};

const getFilmsHistory = (films) => {
  return films.filter((film) => film.userDetails.alreadyWatched);
};

const getFilmsFavorites = (films) => {
  return films.filter((film) => film.userDetails.favorite);
};

const getFilmsByFilter = (films, filterType) => {
  switch (filterType) {
    case FilterType.WATCHLIST:
      return getFilmsWatchlist(films);
    case FilterType.HISTORY:
      return getFilmsHistory(films);
    case FilterType.FAVORITES:
      return getFilmsFavorites(films);
  }

  return films;
};

export {getFilmsByFilter};
