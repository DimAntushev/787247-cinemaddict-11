const Filters = {
  "watchlist": 0,
  "history": 0,
  "favorites": 0
};

const generateFilters = (films, filters = Filters) => {
  films.forEach((film) => {
    if (film.userDetails.watchlist) {
      filters[`watchlist`] += 1;
    }

    if (film.userDetails.alreadyWatched) {
      filters[`history`] += 1;
    }

    if (film.userDetails.favorite) {
      filters[`favorites`] += 1;
    }
  });

  return filters;
};

export {generateFilters};
