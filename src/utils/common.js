import moment from 'moment';

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

export {
  getRandomNumber,
  getRandomNumberFloat,
  getRandomElementFromArray,
  formatDateFilmCard,
  formatDateComment,
  formatRuntime,
  formatDateFilmCardDetails,
  Keys};

