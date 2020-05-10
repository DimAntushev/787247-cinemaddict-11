const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
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

const createElement = (markup) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = markup;

  return newElement.firstChild;
};

const render = (container, element, position = `beforeend`) => {
  if (position === `afterbegin`) {
    container.prepend(element);
  }

  if (position === `beforeend`) {
    container.append(element);
  }
};

export {getRandomNumber, getRandomNumberFloat, getRandomElementFromArray, createElement, render, RenderPosition};

