const FilterTypeStats = {
  ALL_TIME: `all time`,
  TODAY: `today`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`
};

const getAllGenres = (films) => {
  const genres = [];
  films.forEach((film) => {
    film.filmInfo.genre.forEach((genre) => {
      if (!genres.includes(genre)) {
        genres.push(genre);
      }
    });
  });

  return genres;
};

const searchGenreOfFilm = (film, genre) => {
  return film.filmInfo.genre.findIndex((genreFilm) => {
    const isWatching = film.userDetails.alreadyWatched;
    const isGenreFilm = genreFilm === genre;
    return isWatching && isGenreFilm;
  });
};

const getCountFilmsOfGenre = (genre, films) => {
  let count = 0;
  films.forEach((film) => {
    const thisGenre = searchGenreOfFilm(film, genre);
    if (thisGenre !== -1) {
      count = count + 1;
    }
  });

  return count;
};

const getGenresAndCount = (films) => {
  const genres = getAllGenres(films);
  return genres.map((genreFilm) => {
    return {
      genre: genreFilm,
      countFilms: getCountFilmsOfGenre(genreFilm, films)
    };
  });
};

const getTopGenre = (genres) => {
  let maxFilms = 0;
  let result = ``;
  genres.forEach((genre) => {
    if (genre.countFilms > maxFilms) {
      maxFilms = genre.countFilms;
      result = genre.genre;
    }
  });

  return result;
};

const getUserInfo = (films, genres) => {
  let count = 0;
  let totalDurationUser = 0;
  films.forEach((film) => {
    if (film.userDetails.alreadyWatched) {
      count = count + 1;
      totalDurationUser = totalDurationUser + film.filmInfo.runtime;
    }
  });

  return {
    alreadyWatched: count,
    totalDuration: totalDurationUser,
    topGenre: getTopGenre(genres)
  };
};

export {FilterTypeStats, getGenresAndCount, getUserInfo, getAllGenres};
