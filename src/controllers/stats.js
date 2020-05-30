import {render} from './../utils/render.js';
import StatsComponent from './../components/stats.js';
import {getGenresAndCount} from './../utils/stats.js';


export default class StatsController {
  constructor(container, filmsModel) {
    this._container = container;
    this._filmsModel = filmsModel;

    this._statsComponent = null;
  }

  render() {
    const genresOfFilms = getGenresAndCount(this._filmsModel.getFilmsAll());


    this._statsComponent = new StatsComponent(this._filmsModel);
    render(this._container, this._statsComponent);

    this._statsComponent.renderStats(genresOfFilms);
  }

  show() {
    this._statsComponent.show();
  }

  hide() {
    this._statsComponent.hide();
  }
}
