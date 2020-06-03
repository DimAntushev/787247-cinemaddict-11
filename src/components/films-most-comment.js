import AbstractComponent from './abstract-component.js';

const createFilmsMostCommentTemplate = () => {
  return (
    `<section class="films-list--extra">
        <h2 class="films-list__title">Most commented</h2>

        <div class="films-list__container"></div>
     </section>`
  );
};

export default class FilmsMostComment extends AbstractComponent {
  getTemplate() {
    return createFilmsMostCommentTemplate();
  }

  getContainer() {
    return this.getElement().querySelector(`.films-list__container`);
  }

  removeFilmsCards() {
    this.getElement().querySelector(`.films-list__container`).innerHTML = ``;
  }
}
