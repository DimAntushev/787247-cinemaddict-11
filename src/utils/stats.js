const genres = [
  `Drama`,
  `Western`,
  `Thriller`,
  `Comedy`,
  `Adventure`
];

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
  const genresFilm = [
    `Drama`,
    `Western`,
    `Thriller`,
    `Comedy`,
    `Adventure`
  ];

  return genresFilm.map((genreFilm) => {
    return {
      genre: genreFilm,
      countFilms: getCountFilmsOfGenre(genreFilm, films)
    };
  });
};

const getTopGenre = (genresFilm) => {
  let max = 0;
  let currentGenre = ``;
  genresFilm.forEach((genre) => {
    if (genre.countFilms > max) {
      max = genre.countFilms;
      currentGenre = genre.genre;
    }
  });

  return currentGenre;
};

const getUserInfo = (films, genresFilm) => {
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
    topGenre: getTopGenre(genresFilm)
  };
};

export {genres, getGenresAndCount, getUserInfo};
