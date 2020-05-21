import AbstractComponent from './abstract-component.js';

const createMainBlockFilmsTemplate = () => {
  return (
    `<section class="films">

     </section>`
  );
};

export default class MainBlockFilms extends AbstractComponent {
  getTemplate() {
    return createMainBlockFilmsTemplate();
  }
}
