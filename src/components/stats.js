import {FilterTypeStats} from './../utils/stats.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {getAchiveUser} from './../utils/common.js';
import AbstractComponent from './abstract-smart-component.js';

const MINUTES_IN_HOURS = 60;

const getGenres = (genresFilms) => {
  const genres = [];

  genresFilms.forEach((genreFilm) => {
    genres.push(genreFilm.genre);
  });

  return genres;
};

const getCountGenres = (genresFilms) => {
  const genreCount = [];

  genresFilms.forEach((genreFilm) => {
    genreCount.push(genreFilm.countFilms);
  });

  return genreCount;
};

const createStatsTemplate = (userInfo, activeFilter, filmsCount) => {

  const {alreadyWatched, totalDuration, topGenre} = userInfo;

  const hoursTotal = Math.floor(totalDuration / MINUTES_IN_HOURS);
  const minutesTotal = totalDuration % MINUTES_IN_HOURS;
  const achiveUser = getAchiveUser(filmsCount);

  return (
    `<section class="statistic">
      <p class="statistic__rank">
        Your rank ${achiveUser}
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">Sci-Fighter</span>
      </p>

      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>

        <input ${activeFilter === FilterTypeStats.ALL ? `checked` : ``} type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
        <label for="statistic-all-time" class="statistic__filters-label">All time</label>

        <input ${activeFilter === FilterTypeStats.TODAY ? `checked` : ``} type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
        <label for="statistic-today" class="statistic__filters-label">Today</label>

        <input ${activeFilter === FilterTypeStats.WEEK ? `checked` : ``} type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
        <label for="statistic-week" class="statistic__filters-label">Week</label>

        <input ${activeFilter === FilterTypeStats.MONTH ? `checked` : ``} type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
        <label for="statistic-month" class="statistic__filters-label">Month</label>

        <input ${activeFilter === FilterTypeStats.YEAR ? `checked` : ``} type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
        <label for="statistic-year" class="statistic__filters-label">Year</label>
      </form>

      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${alreadyWatched} <span class="statistic__item-description">movies</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">${hoursTotal > 0 ? hoursTotal : `0`}<span class="statistic__item-description">h</span> ${minutesTotal > 0 ? minutesTotal : `0`} <span class="statistic__item-description">m</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${topGenre}</p>
        </li>
      </ul>

      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>
    </section>`
  );
};

const renderStats = (genresFilms) => {
  const BAR_HEIGHT = 50;
  const statisticCtx = document.querySelector(`.statistic__chart`).getContext(`2d`);
  const countGenres = genresFilms.length;
  statisticCtx.height = BAR_HEIGHT * countGenres;

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: getGenres(genresFilms),
      datasets: [{
        data: getCountGenres(genresFilms),
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 24
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
};


export default class Stats extends AbstractComponent {
  constructor(infoUser, activeFilterStats, filmsCount) {
    super();

    this._infoUser = infoUser;
    this._activeFilterStats = activeFilterStats;
    this._filmsCount = filmsCount;
  }

  getTemplate() {
    return createStatsTemplate(this._infoUser, this._activeFilterStats, this._filmsCount);
  }

  renderStats(genresFilm) {
    renderStats(genresFilm);
  }

  setAllClickHandler(handler) {
    this.getElement().querySelector(`#statistic-all-time`).addEventListener(`click`, handler);
  }

  setTodayClickHandler(handler) {
    this.getElement().querySelector(`#statistic-today`).addEventListener(`click`, handler);
  }

  setWeekClickHandler(handler) {
    this.getElement().querySelector(`#statistic-week`).addEventListener(`click`, handler);
  }

  setMonthClickHandler(handler) {
    this.getElement().querySelector(`#statistic-month`).addEventListener(`click`, handler);
  }

  setYearClickHandler(handler) {
    this.getElement().querySelector(`#statistic-year`).addEventListener(`click`, handler);
  }
}
