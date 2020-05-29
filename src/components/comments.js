import {formatDateComment} from "../utils/common";
import AbstractSmartComponent from './abstract-smart-component.js';

const createCommentMarkup = (commentUser) => {
  const {id, emotion, date, author, comment} = commentUser;

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
        <div for="add-emoji" class="film-details__add-emoji-label">
          ${emoji ? `<img src="images/emoji/${emoji}.png" width="55" height="55" alt="emoji-smile">` : ``}
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

export default class CommentsComponent extends AbstractSmartComponent {
  constructor(comments) {
    super();

    this._comments = comments;

    this._subscribeOnEvents();
  }

  getTemplate() {
    return createCommentsTemplate(this._comments, this._currentEmoji);
  }

  recoveryListeners() {
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();
  }

  reset() {
    this._currentEmoji = null;

    this.rerender();
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.film-details__emoji-list`).addEventListener(`click`, (evt) => {
      const hideInputEmoji = this.getElement()
        .querySelector(`.film-details__emoji-item[name="comment-emoji"]`);
      if (evt.target.tagName === `INPUT`) {
        this._currentEmoji = evt.target.id.replace(`emoji-`, ``);
        hideInputEmoji.value = evt.target.value;
        this.rerender();
      }
    });
  }

  setDeleteClickHandler(handler) {
    this.getElement().querySelector(`.film-details__comments-list`).addEventListener(`click`, (evt) => {
      const currentElement = evt.target;
      const isDeleteButton = currentElement.classList.contains(`film-details__comment-delete`);
      if (isDeleteButton) {
        const idComment = Number(evt.target.dataset.idComment);
        handler(idComment);
      }
    });
  }
}
