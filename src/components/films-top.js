import AbstractComponent from './abstract-component.js';

const createFilmsTopTemplate = () => {
  return (
    `<section class="films-list--extra">
        <h2 class="films-list__title">Top rated</h2>

        <div class="films-list__container"></div>
     </section>`
  );
};

export default class FilmsTop extends AbstractComponent {
  getTemplate() {
    return createFilmsTopTemplate();
  }

  getContainer() {
    return this.getElement().querySelector(`.films-list__container`);
  }
}
