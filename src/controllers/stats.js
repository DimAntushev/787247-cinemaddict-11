import {render, replace} from './../utils/render.js';
import StatsComponent from './../components/stats.js';
import {FilterTypeStats, getGenresAndCount, getUserInfo} from './../utils/stats.js';
import {getTodayFilms, getFilmsByWeek, getFilmsByMonth, getFilmsByYear} from './../utils/common.js';

export default class StatsController {
  constructor(container, filmsModel) {
    this._container = container;
    this._filmsModel = filmsModel;
    this._films = this._filmsModel.getWatchedFilms();
    this._filmsCount = this._films.length;
    this._genresOfFilms = null;
    this._userInfo = null;

    this._activeFilterStats = FilterTypeStats.ALL_TIME;
  }

  render(films) {
    this._filmsStats = films;
    this._genresOfFilms = getGenresAndCount(this._filmsStats);
    this._userInfo = getUserInfo(this._filmsStats, this._genresOfFilms);
    const oldStatsComponent = this._statsComponent;
    this._statsComponent = new StatsComponent(this._userInfo, this._activeFilterStats, this._filmsCount);
    render(this._container, this._statsComponent);
    this._statsComponent.renderStats(this._genresOfFilms);

    this._statsComponent.setAllClickHandler(() => {
      this._filmsStats = this._films;
      this._activeFilterStats = FilterTypeStats.ALL_TIME;
      this._refresh(this._filmsStats);
    });

    this._statsComponent.setTodayClickHandler(() => {
      this._filmsStats = getTodayFilms(this._films);
      this._activeFilterStats = FilterTypeStats.TODAY;
      this._refresh(this._filmsStats);
    });

    this._statsComponent.setWeekClickHandler(() => {
      this._filmsStats = getFilmsByWeek(this._films);
      this._activeFilterStats = FilterTypeStats.WEEK;
      this._refresh(this._filmsStats);
    });

    this._statsComponent.setMonthClickHandler(() => {
      this._filmsStats = getFilmsByMonth(this._films);
      this._activeFilterStats = FilterTypeStats.MONTH;
      this._refresh(this._filmsStats);
    });

    this._statsComponent.setYearClickHandler(() => {
      this._filmsStats = getFilmsByYear(this._films);
      this._activeFilterStats = FilterTypeStats.YEAR;
      this._refresh(this._filmsStats);
    });

    if (oldStatsComponent) {
      replace(this._statsComponent, oldStatsComponent);
    } else {
      render(this._container, this._statsComponent);
    }
  }

  show() {
    this._films = this._filmsModel.getFilmsAll();
    this._refresh(this._films);
    this._statsComponent.show();
  }

  hide() {
    this._statsComponent.hide();
    this._activeFilterStats = FilterTypeStats.ALL_TIME;
  }

  _refresh(films) {
    this.render(films, this._activeFilterStats);
    this._statsComponent.renderStats(this._genresOfFilms);
  }
}
