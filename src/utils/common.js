import moment from 'moment';

const MIN_FILMS_NOVICE_ACHIVE = 1;
const MIN_FILMS_FAN_ACHIVE = 11;
const MIN_FILMS_MOVE_BUFF_ACHIVE = 21;

const Keys = {
  ESC: `Esc`,
  ESCAPE: `Escape`,
  ENTER: `Enter`,
  CTRL: `Control`
};

const formatDateFilmCard = (date) => {
  return moment(date).format(`YYYY`);
};

const formatDateComment = (date) => {
  return moment(date).fromNow();
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

const getAchiveUser = (filmsCount) => {
  let achive = ``;

  if (filmsCount >= MIN_FILMS_NOVICE_ACHIVE) {
    achive = `novice`;
  }

  if (filmsCount >= MIN_FILMS_FAN_ACHIVE) {
    achive = `fan`;
  }

  if (filmsCount >= MIN_FILMS_MOVE_BUFF_ACHIVE) {
    achive = `movie buff`;
  }

  return achive;
};

export {
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

