import AbstractComponent from './abstract-component.js';
import {getAchiveUser} from './../utils/common.js';

const createUserProfileTemplate = (filmsCount) => {
  const achiveUser = getAchiveUser(filmsCount);

  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${achiveUser}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class UserProfile extends AbstractComponent {
  constructor(filmsCount) {
    super();

    this._filmsCount = filmsCount;
  }

  getTemplate() {
    return createUserProfileTemplate(this._filmsCount);
  }
}
