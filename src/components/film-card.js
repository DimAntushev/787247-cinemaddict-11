import {formatDateFilmCard, formatRuntimeInMinutes} from './../utils/common.js';
import AbstractComponent from './abstract-component.js';

const MAX_LENGTH_DESCRIPTION = 140;

const createFilmCardTemplate = (film) => {
  const {filmInfo, userDetails, comments} = film;

  const releaseDate = formatDateFilmCard(filmInfo.release.date);
  const runtime = formatRuntimeInMinutes(filmInfo.runtime);
  const description = filmInfo.description.length > 140 ?
    filmInfo.description.slice(0, MAX_LENGTH_DESCRIPTION) + `...` : filmInfo.description;

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${filmInfo.title}</h3>
      <p class="film-card__rating">${filmInfo.totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseDate}</span>
        <span class="film-card__duration">${runtime}</span>
        <span class="film-card__genre">${filmInfo.genre}</span>
      </p>
      <img src="${filmInfo.poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${description}</p>
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
  constructor(film, comments) {
    super();

    this._film = film;
    this._comments = comments;
  }

  getTemplate() {
    return createFilmCardTemplate(this._film, this._comments);
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

