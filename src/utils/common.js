import moment from 'moment';

const DAY_OF_WEEK = 7;
const DAY_OF_MONTH = 30;
const DAY_OF_YEAR = 365;

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

const getFilmsToday = (films) => {
  const dateNow = new Date();

  return films.filter((film) => {
    return film.userDetails.watchingDate.getDay() === dateNow.getDay();
  });
};

const getFilmsWeek = (films) => {
  const date = new Date();
  date.setDate(date.getDate() - DAY_OF_WEEK);

  return films.filter((film) => {
    return film.userDetails.watchingDate >= date;
  });
};

const getFilmsMonth = (films) => {
  const dateNow = new Date();
  dateNow.setDate(dateNow.getDate() - DAY_OF_MONTH);

  return films.filter((film) => {
    return film.userDetails.watchingDate >= dateNow;
  });
};

const getFilmsYear = (films) => {
  const dateNow = new Date();
  dateNow.setDate(dateNow.getDate() - DAY_OF_YEAR);

  return films.filter((film) => {
    return film.userDetails.watchingDate >= dateNow;
  });
};

const formatRuntime = (date) => {
  return moment(date).format(`h`) + `h ` + moment(date).format(`mm`) + `m`;

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
  formatRuntime,
  formatDateFilmCardDetails,
  getFilmsToday,
  getFilmsWeek,
  getFilmsMonth,
  getFilmsYear,
  getAchiveUser,
  Keys};

