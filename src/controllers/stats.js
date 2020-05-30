import {render, replace} from './../utils/render.js';
import StatsComponent from './../components/stats.js';
import {getGenresAndCount, getUserInfo} from './../utils/stats.js';


export default class StatsController {
  constructor(container, filmsModel) {
    this._container = container;
    this._filmsModel = filmsModel;
    this._films = null;
    this._genresOfFilms = null;

    this._statsComponent = null;
  }

  render() {
    this._films = this._filmsModel.getFilmsAll();
    this._genresOfFilms = getGenresAndCount(this._films);
    const userInfo = getUserInfo(this._films, this._genresOfFilms);

    const oldStatsComponent = this._statsComponent;
    this._statsComponent = new StatsComponent(userInfo);
    render(this._container, this._statsComponent);
    this._statsComponent.renderStats(this._genresOfFilms);

    if (oldStatsComponent) {
      replace(this._statsComponent, oldStatsComponent);
    } else {
      render(this._container, this._statsComponent);
    }
  }

  show() {
    this._statsComponent.show();
  }

  hide() {
    this._statsComponent.hide();
  }
}
