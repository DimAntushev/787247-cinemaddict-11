const genres = [
  `Drama`,
  `Western`,
  `Thriller`,
  `Comedy`,
  `Adventure`
];

const searchGenreOfFilm = (film, genre) => {
  return film.filmInfo.genre.findIndex((genreFilm) => genreFilm === genre);
};

const getCountFilmsOfGenre = (genre, films) => {
  let count = 0;
  films.forEach((film) => {
    const thisGenre = searchGenreOfFilm(film, genre);
    if (thisGenre) {
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

export {genres, getGenresAndCount};
