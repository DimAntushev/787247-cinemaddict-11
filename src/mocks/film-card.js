import {getRandomNumber, getRandomNumberFloat, getRandomElementFromArray} from '../utils/common.js';

const MIN_NUMBER_COMMENTS = 1;
const MAX_NUMBER_COMMENTS = 17;
const MIN_RATING = 4;
const MAX_RATING = 10;
const MIN_AGE_RATING = 0;
const MAX_AGE_RATING = 21;
const MIN_NUMBER_NAMES = 1;
const MAX_NUMBER_NAMES = 10;
const MIN_NUMBER_GENRE = 1;
const MAX_NUMBER_GENRE = 4;

const names = [
  `Властелин колец: Братство колца`,
  `Властелин колец: Две крепосты`,
  `Властелин колец: Возвращение короля`,
  `Хобби: Нежданной путешествие`,
  `Хоббит: Пустошь Смауга`,
  `Хоббит: Битва пяти воинств`,
  `Автостопом по галактике`,
  `Джентельмены`,
  `Великий уравнитель`
];
const posters = [
  `./images/posters/made-for-each-other.png`,
  `./images/posters/popeye-meets-sinbad.png`,
  `./images/posters/sagebrush-trail.jpg`,
  `./images/posters/santa-claus-conquers-the-martians.jpg`,
  `./images/posters/the-dance-of-life.jpg`,
  `./images/posters/the-great-flamarion.jpg`,
  `./images/posters/the-man-with-the-golden-arm.jpg`
];
const descriptions = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam
    faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`
];
const countries = [
  `USA`,
  `England`,
  `Russia`,
  `China`
];
const emotions = [`smile`, `sleeping`, `puke`, `angry`];

const getRandomDate = () => {
  const currentDate = new Date();

  currentDate.setFullYear(getRandomNumber(2000, 2020), getRandomNumber(0, 11), getRandomNumber(1, 31));

  return currentDate;
};
const generateNames = (count = MIN_NUMBER_NAMES) => {
  const namesGenerate = [];

  const firstNames = [
    `Джон`,
    `Игорь`,
    `Жан`,
    `Рокки`
  ];
  const lastNames = [
    `Николаев`,
    `Нолан`,
    `Алексагов`,
    `Бодров`
  ];

  while (count) {
    namesGenerate.push(getRandomElementFromArray(firstNames) + ` ` + getRandomElementFromArray(lastNames));

    count--;
  }

  return namesGenerate;
};
const generateGenres = (count = MIN_NUMBER_GENRE) => {
  let genresGenerate = [];

  const genres = [
    `Drama`,
    `Western`,
    `Thriller`,
    `Comedy`,
    `Adventure`
  ];

  while (count) {
    const genreRandomNumber = getRandomNumber(0, genres.length - 1);
    genresGenerate.push(genres[genreRandomNumber]);
    genres.splice(genreRandomNumber, 1);

    count--;
  }

  return genresGenerate;
};
const generateComments = (count) => {
  return Array(count)
    .fill(``)
    .map((item, idComment) => {
      return {
        id: idComment,
        emotion: getRandomElementFromArray(emotions),
        date: Date.now(),
        author: `Джек Петров`,
        comment: getRandomElementFromArray(descriptions)
      };
    });
};

const generateFilm = (idFilm) => {
  return {
    id: idFilm,
    comments: generateComments(getRandomNumber(MIN_NUMBER_COMMENTS, MAX_NUMBER_COMMENTS)),
    filmInfo: {
      title: getRandomElementFromArray(names),
      alternativeTitle: getRandomElementFromArray(names),
      totalRating: getRandomNumberFloat(MIN_RATING, MAX_RATING),
      poster: getRandomElementFromArray(posters),
      ageRating: getRandomNumber(MIN_AGE_RATING, MAX_AGE_RATING),
      director: generateNames().join(``),
      writers: generateNames(getRandomNumber(MIN_NUMBER_NAMES, MAX_NUMBER_NAMES)),
      actors: generateNames(getRandomNumber(MIN_NUMBER_NAMES, MAX_NUMBER_NAMES)),
      release: {
        date: getRandomDate(),
        releaseCountry: getRandomElementFromArray(countries)
      },
      runtime: getRandomNumber(100000000, 1000000000000),
      genre: generateGenres(getRandomNumber(MIN_NUMBER_GENRE, MAX_NUMBER_GENRE)),
      description: getRandomElementFromArray(descriptions)
    },
    userDetails: {
      watchlist: Math.random() > 0.5 ? true : false,
      alreadyWatched: Math.random() > 0.5 ? true : false,
      watchingDate: getRandomDate(),
      favorite: Math.random() > 0.5 ? true : false
    }
  };
};

const generateFilms = (count) => {
  return Array(count)
    .fill(``)
    .map((film, idFilm) => {
      return generateFilm(idFilm);
    });
};

export {generateFilms};
