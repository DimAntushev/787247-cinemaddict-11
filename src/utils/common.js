import moment from 'moment';

const MIN_IN_HOURS = 60;

const Keys = {
  ESC: `Esc`,
  ESCAPE: `Escape`,
  ENTER: `Enter`,
  CTRL_LEFT: `ControlLeft`
};

const formatDateFilmCard = (date) => {
  return moment(date).format(`YYYY`);
};

const formatDateComment = (date) => {
  return moment(date).format(`YYYY/MM/DD hh:mm`);
};

const getTodayFilms = (films) => {
  return films.filter((film) => {
    const diffTime = moment().diff(film.userDetails.watchingDate, `days`);
    return diffTime < 1;
  });
};

const getFilmsByWeek = (films) => {
  return films.filter((film) => {
    const diffTime = moment().diff(film.userDetails.watchingDate, `week`);
    return diffTime < 1;
  });
};

const getFilmsByMonth = (films) => {
  return films.filter((film) => {
    const diffTime = moment().diff(film.userDetails.watchingDate, `month`);
    return diffTime < 1;
  });
};

const getFilmsByYear = (films) => {
  return films.filter((film) => {
    const diffTime = moment().diff(film.userDetails.watchingDate, `year`);
    return diffTime < 1;
  });
};

const formatRuntimeInMinutes = (runtime) => {
  const hourse = moment.duration(runtime, `minutes`).get(`hours`);
  const minutes = moment.duration(runtime, `minutes`).get(`minutes`);
  return `${hourse > 0 ? `${hourse}h ` : ``}` + `${minutes}m`;
};

const formatDateFilmCardDetails = (date) => {
  return moment(date).format(`DD MMMM YYYY`);
};

const getRandomNumber = (min, max) => {
  return Math.round(Math.random() * (max - min)) + min;
};

const getRandomNumberFloat = (min, max) => {
  return Math.floor((Math.random() * (max - min)) * 10) / 10 + min;
};

const getRandomElementFromArray = (elements) => {
  return elements[getRandomNumber(0, elements.length - 1)];
};

const getAchiveUser = (filmsCount) => {
  let achive = ``;

  if (filmsCount >= 1) {
    achive = `novice`;
  }

  if (filmsCount >= 11) {
    achive = `fan`;
  }

  if (filmsCount >= 21) {
    achive = `movie buff`;
  }

  return achive;
};

export {
  getRandomNumber,
  getRandomNumberFloat,
  getRandomElementFromArray,
  formatDateFilmCard,
  formatDateComment,
  formatRuntimeInMinutes,
  formatDateFilmCardDetails,
  getTodayFilms,
  getFilmsByWeek,
  getFilmsByMonth,
  getFilmsByYear,
  getAchiveUser,
  Keys};

