import AbstractComponent from './abstract-component.js';

const createMoreButtonTemplate = () => {
  return (
    `<button class="films-list__show-more">Show more</button>`
  );
};

export default class MoreButton extends AbstractComponent {
  getTemplate() {
    return createMoreButtonTemplate();
  }

  setClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }

  removeClickHandler(handler) {
    this.getElement().removeEventListener(`click`, handler);
  }
}
