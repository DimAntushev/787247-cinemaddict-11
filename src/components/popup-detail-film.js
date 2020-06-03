import {formatDateFilmCardDetails, formatRuntimeInMinutes} from './../utils/common.js';
import AbstractSmartComponent from './abstract-smart-component';
import {formatDateComment} from './../utils/common';
import {encode} from 'he';

const TEXTAREA_BORDER_RED = `1px #f00 solid`;
const ANIMATION_NAME = `shake`;
const EMOJI_PREFIX = `emoji-`;

const ButtonDeleteText = {
  DEFAULT: `Delete`,
  DELETING: `Deleting...`
};

const createGenreMarkup = (genres) => {
  return genres.map((genre) => {
    return `<span class="film-details__genre">${genre}</span>`;
  }).join(`\n`);
};

const createCommentMarkup = (commentUser) => {
  const {id, emotion, date, author, comment: notSanitizedComment} = commentUser;

  const comment = encode(notSanitizedComment);
  const commentDate = formatDateComment(date);

  return (
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-smile">
      </span>
      <div>
        <p class="film-details__comment-text">${comment}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${commentDate}</span>
          <button class="film-details__comment-delete" data-id-comment="${id}" type="button">Delete</button>
        </p>
      </div>
    </li>`
  );
};

const createCommentsMarkup = (comments) => {
  return comments
    .map((comment) => {
      return createCommentMarkup(comment);
    }).join(`\n`);
};

const createCommentsTemplate = (comments, emoji) => {
  return (
    `<section class="film-details__comments-wrap" data-id-next-comment = ${comments.length}>
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

      <ul class="film-details__comments-list">
        ${createCommentsMarkup(comments)}
      </ul>

      <div class="film-details__new-comment">
        <div for="add-emoji" class="film-details__add-emoji-label" data-emoji=${emoji}>
          ${emoji ? `<img src="images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">` : ``}
        </div>

        <label class="film-details__comment-label">
          <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
        </label>

        <div class="film-details__emoji-list">
          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
          <label class="film-details__emoji-label" for="emoji-smile">
            <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
          <label class="film-details__emoji-label" for="emoji-sleeping">
            <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
          <label class="film-details__emoji-label" for="emoji-puke">
            <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
          <label class="film-details__emoji-label" for="emoji-angry">
            <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
          </label>
        </div>
      </div>
    </section>`
  );
};

const createPopupDetailFilmTemplate = (film, emoji, comments) => {
  const {filmInfo, userDetails} = film;

  const releaseDate = formatDateFilmCardDetails(filmInfo.release.date);
  const runtime = formatRuntimeInMinutes(filmInfo.runtime);

  return (
    `<section class="film-details" data-id-film=${film.id}>
      <form class="film-details__inner" method="get">
        <div class="form-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="${filmInfo.poster}" alt="">

              <p class="film-details__age">${filmInfo.ageRating}+</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${filmInfo.title}</h3>
                  <p class="film-details__title-original">${filmInfo.alternativeTitle}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${filmInfo.totalRating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${filmInfo.director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${filmInfo.writers.join(`, `)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${filmInfo.actors.join(`, `)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">
                        ${releaseDate}
                   </td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${runtime}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${filmInfo.release.releaseCountry}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">${filmInfo.genre.length > 1 ? `Genres` : `Genre`}</td>
                  <td class="film-details__cell">
                    ${createGenreMarkup(filmInfo.genre)}
                </tr>
              </table>

              <p class="film-details__film-description">${filmInfo.description}</p>
            </div>
          </div>

          <section class="film-details__controls">
            <input
              type="checkbox"
              class="film-details__control-input visually-hidden"
              id="watchlist" name="watchlist"
              ${userDetails.watchlist ? `checked` : ``}
             >
            <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

            <input
              type="checkbox"
              class="film-details__control-input visually-hidden"
              id="watched"
              name="watched"
              ${userDetails.alreadyWatched ? `checked` : ``}
            >
            <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

            <input
              type="checkbox"
              class="film-details__control-input visually-hidden"
              id="favorite"
              name="favorite"
              ${userDetails.favorite ? `checked` : ``}
            >
            <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
          </section>
        </div>

        <div class="form-details__bottom-container" id="comments">
            ${createCommentsTemplate(comments, emoji)}
        </div>
      </form>
    </section>`
  );
};

export default class PopupDetailFilm extends AbstractSmartComponent {
  constructor(film, comments) {
    super();

    this._currentEmoji = null;
    this._film = film;
    this._comments = comments;

    this._setDeleteClickHandler = null;
    this._setCloseClickHandler = null;
    this._removeCloseClickHandler = null;
    this._setAddToWatchlistClickHandler = null;
    this._setAddMarkAsWatchedHandler = null;
    this._setAddFavoriteHandler = null;
    this._removeEnterDownHandler = null;


    this._subscribeOnEvents();
  }

  getTemplate() {
    return createPopupDetailFilmTemplate(this._film, this._currentEmoji, this._comments);
  }

  recoveryListeners() {
    this.setDeleteClickHandler(this._setDeleteClickHandler);
    this.setCloseClickHandler(this._setCloseClickHandler);
    this.removeCloseClickHandler(this._removeCloseClickHandler);
    this.setAddToWatchlistClickHandler(this._setAddToWatchlistClickHandler);
    this.setAddMarkAsWatchedHandler(this._setAddMarkAsWatchedHandler);
    this.setAddFavoriteHandler(this._setAddFavoriteHandler);
    this.removeEnterDownHandler(this._removeEnterDownHandler);

    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();
  }

  resetCommentFilter() {
    const formFilmElement = this.getElement().querySelector(`.film-details__inner`);
    formFilmElement.classList.remove(ANIMATION_NAME);

    const commentsFieldElement = this.getElement()
      .querySelector(`.film-details__comment-input`);
    const emojiElement = this.getElement()
      .querySelector(`.film-details__add-emoji-label img`);

    commentsFieldElement.value = ``;
    commentsFieldElement.style.border = `none`;
    if (emojiElement) {
      emojiElement.remove();
    }
  }

  activeFormOnline() {
    const deleteButtonsElements = this.getElement().querySelectorAll(`.film-details__comment-delete`);
    deleteButtonsElements.forEach((button) => {
      button.classList.remove(`visually-hidden`);
    });

    const textareaCommentElement = this.getElement().querySelector(`.film-details__comment-input`);
    textareaCommentElement.disabled = false;

    const emojiListElement = this.getElement().querySelector(`.film-details__emoji-list`);
    emojiListElement.classList.remove(`visually-hidden`);
  }

  disabledFormOffline() {
    const deleteButtonsElement = this.getElement().querySelectorAll(`.film-details__comment-delete`);
    deleteButtonsElement.forEach((button) => {
      button.classList.add(`visually-hidden`);
    });

    const textareaCommentElement = this.getElement().querySelector(`.film-details__comment-input`);
    textareaCommentElement.disabled = true;

    const emojiListElement = this.getElement().querySelector(`.film-details__emoji-list`);
    emojiListElement.classList.add(`visually-hidden`);
  }

  disabledForm() {
    const formFilmElement = this.getElement().querySelector(`.film-details__inner`);
    formFilmElement.classList.remove(ANIMATION_NAME);
    const textareaCommentElement = this.getElement().querySelector(`.film-details__comment-input`);
    textareaCommentElement.disabled = true;
    textareaCommentElement.style.border = `none`;
  }

  errorForm() {
    const formFilmElement = this.getElement().querySelector(`.film-details__inner`);
    formFilmElement.disabled = true;
    formFilmElement.classList.add(ANIMATION_NAME);
    formFilmElement.querySelector(`.film-details__comment-input`).style.border = TEXTAREA_BORDER_RED;
  }

  disabledButton(buttonElement, blockCommentElement) {
    buttonElement.disabled = true;
    buttonElement.textContent = ButtonDeleteText.DELETING;
    blockCommentElement.classList.remove(ANIMATION_NAME);
  }

  errorButton(buttonElement, blockCommentElement) {
    buttonElement.disabled = false;
    buttonElement.textContent = ButtonDeleteText.DEFAULT;
    blockCommentElement.classList.add(ANIMATION_NAME);
  }

  getCurrentEmoji() {
    return this.getElement().querySelector(`.film-details__add-emoji-label`).dataset.emoji;
  }

  getCommentText() {
    return this.getElement().querySelector(`.film-details__comment-input`).value;
  }

  setDeleteClickHandler(handler) {
    this.getElement().querySelector(`.film-details__comments-list`).addEventListener(`click`, (evt) => {
      const currentButtonElement = evt.target;
      const currentListElement = evt.currentTarget;
      const isDeleteButton = currentButtonElement.classList.contains(`film-details__comment-delete`);
      if (isDeleteButton) {
        const idFilm = Number(this.getElement().dataset.idFilm);
        const idComment = Number(currentButtonElement.dataset.idComment);
        handler(idFilm, idComment, currentButtonElement, currentListElement);
      }

      this._setDeleteClickHandler = handler;

      this.rerender();
    });
  }

  removeEnterDownHandler(handler) {
    document.removeEventListener(`keydown`, handler);

    this._removeEnterDownHandler = handler;
  }

  setCloseClickHandler(handler) {
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, handler);

    this._setCloseClickHandler = handler;
  }

  removeCloseClickHandler(handler) {
    this.getElement().querySelector(`.film-details__close-btn`).removeEventListener(`click`, handler);

    this._removeCloseClickHandler = handler;
  }

  setAddToWatchlistClickHandler(handler) {
    this.getElement()
      .querySelector(`.film-details__control-label--watchlist`)
      .addEventListener(`click`, handler);

    this._setAddToWatchlistClickHandler = handler;
  }

  setAddMarkAsWatchedHandler(handler) {
    this.getElement()
      .querySelector(`.film-details__control-label--watched`)
      .addEventListener(`click`, handler);

    this._setAddMarkAsWatchedHandler = handler;
  }

  setAddFavoriteHandler(handler) {
    this.getElement()
      .querySelector(`.film-details__control-label--favorite`)
      .addEventListener(`click`, handler);

    this._setAddFavoriteHandler = handler;
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.film-details__emoji-list`).addEventListener(`click`, (evt) => {
      const hideInputEmojiElement = this.getElement()
        .querySelector(`.film-details__emoji-item[name="comment-emoji"]`);
      if (evt.target.tagName === `INPUT`) {
        this._currentEmoji = evt.target.id.replace(EMOJI_PREFIX, ``);
        hideInputEmojiElement.value = evt.target.value;

        this.rerender();
      }
    });
  }
}
