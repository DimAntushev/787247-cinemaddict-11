import AbstractComponent from './abstract-component.js';

const createFilmCardTemplate = (film) => {
  const {comments, filmInfo, userDetails} = film;

  const releaseDate = new Date(filmInfo.release.date);

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${filmInfo.title}</h3>
      <p class="film-card__rating">${filmInfo.totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseDate.getFullYear()}</span>
        <span class="film-card__duration">${filmInfo.runtime}</span>
        <span class="film-card__genre">${filmInfo.genre}</span>
      </p>
      <img src="${filmInfo.poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${filmInfo.description}</p>
      <a class="film-card__comments">${comments.length} comments</a>
      <form class="film-card__controls">
        <button class="${userDetails.watchlist ? `film-card__controls-item--active` : ``} film-card__controls-item button film-card__controls-item--add-to-watchlist" type="button">
            Add to watchlist
        </button>
        <button class="${userDetails.alreadyWatched ? `film-card__controls-item--active` : ``} film-card__controls-item button film-card__controls-item--mark-as-watched" type="button">
            Mark as watched
        </button>
        <button class="${userDetails.favorite ? `film-card__controls-item--active` : ``} film-card__controls-item button film-card__controls-item--favorite" type="button">
            Mark as
        </button>
      </form>
    </article>`
  );
};

export default class FilmCard extends AbstractComponent {
  constructor(film) {
    super();

    this._film = film;
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  setAddToWatchlistClickHandler(handler) {
    this.getElement()
      .querySelector(`.film-card__controls-item--add-to-watchlist`)
      .addEventListener(`click`, handler);
  }

  setAddMarkAsWatchedHandler(handler) {
    this.getElement()
      .querySelector(`.film-card__controls-item--mark-as-watched`)
      .addEventListener(`click`, handler);
  }

  setAddFavorite(handler) {
    this.getElement()
      .querySelector(`.film-card__controls-item--favorite`)
      .addEventListener(`click`, handler);
  }

  setTitleClickHandler(handler) {
    this.getElement().querySelector(`.film-card__title`).addEventListener(`click`, handler);
  }

  removeTitleClickHandler(handler) {
    this.getElement().querySelector(`.film-card__title`).removeEventListener(`click`, handler);
  }

  setPosterClickHandler(handler) {
    this.getElement().querySelector(`.film-card__poster`).addEventListener(`click`, handler);
  }

  removePosterClickHandler(handler) {
    this.getElement().querySelector(`.film-card__poster`).removeEventListener(`click`, handler);
  }

  setCommentsClickHandler(handler) {
    this.getElement().querySelector(`.film-card__comments`).addEventListener(`click`, handler);
  }

  removeCommentsClickHandler(handler) {
    this.getElement().querySelector(`.film-card__comments`).removeEventListener(`click`, handler);
  }
}

