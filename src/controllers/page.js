import {remove, render, RenderPosition} from '../utils/render';
import NoFilmsComponent from '../components/index-no-data';
import FilmCardComponent from '../components/film-card';
import PopupDetailFilmComponent from '../components/popup-detail-film';
import MoreButtonFilmsComponent from '../components/more-button';
import MainBlockFilmsComponent from '../components/main-block-films';
import FilmsAllComponent from '../components/films-all';
import FilmsTopComponent from '../components/films-top';
import FilmsMostCommentComponent from '../components/films-most-comment';
import FiltersComponent from '../components/filters';
import SortsComponent from '../components/sorts';

const FILMS_NUMBER_COUNT = 5;
const FILMS_TOP_RATED = 2;
const FILMS_MOST_COMMENTED = 2;
let startShowCardsLoad = 0;

const sortingFilms = (films, filmsDefault, sortName) => {
  if (sortName === `date`) {
    return films.slice().sort((filmCurrent, filmNext) => {
      return filmCurrent.filmInfo.release.date - filmNext.filmInfo.release.date;
    });
  } else if (sortName === `rating`) {
    return films.slice().sort((filmCurrent, filmNext) => {
      return filmCurrent.filmInfo.totalRating - filmNext.filmInfo.totalRating;
    });
  }

  films = filmsDefault;

  return films;
};

const renderMainFilmCards = (filmCards, filmList) => {
  const filmsCardsLoad = filmCards.slice(startShowCardsLoad, startShowCardsLoad + FILMS_NUMBER_COUNT);
  renderFilmCards(filmsCardsLoad, filmList);

  startShowCardsLoad += FILMS_NUMBER_COUNT;
};
const renderTopFilmCards = (filmCards, filmList) => {
  renderFilmCards(filmCards, filmList);
};
const renderMostCommentListCards = (filmCards, filmList) => {
  renderFilmCards(filmCards, filmList);
};

const renderShowMoreButton = (filmListMain) => {
  const buttonShowMoreComponent = new MoreButtonFilmsComponent();

  render(filmListMain, buttonShowMoreComponent);

  return buttonShowMoreComponent;
};

const renderMainBlockForFilms = (mainBlockContent) => {
  const mainBlockFilmsComponent = new MainBlockFilmsComponent();

  render(mainBlockContent, mainBlockFilmsComponent);

  return mainBlockFilmsComponent;
};

const renderAllFilmsBlock = (mainBlockFilms) => {
  const filmsAllComponent = new FilmsAllComponent();

  render(mainBlockFilms, filmsAllComponent);

  return filmsAllComponent;
};
const renderTopFilmsBlock = (mainBlockFilms) => {
  const filmsListTopComponent = new FilmsTopComponent();

  render(mainBlockFilms, filmsListTopComponent);

  return filmsListTopComponent;
};
const renderMostCommentFilmsBlock = (mainBlockFilms) => {
  const filmsListMostCommentComponent = new FilmsMostCommentComponent();

  render(mainBlockFilms, filmsListMostCommentComponent);

  return filmsListMostCommentComponent;
};

const renderFilmCards = (filmCards, filmsList) => {
  filmCards.forEach((film) => {
    renderFilm(film, filmsList);
  });
};

const renderFilm = (film, filmsList) => {
  const mainFooter = document.querySelector(`.footer`);
  const filmCardComponent = new FilmCardComponent(film);
  const popupDetailFilmComponent = new PopupDetailFilmComponent(film);

  const showPopupFilm = () => {
    render(mainFooter, popupDetailFilmComponent, RenderPosition.AFTEREND);
  };
  const closePopupFilm = () => {
    remove(popupDetailFilmComponent);
  };

  const addListenerOpenOnElementsFilmCard = () => {
    filmCardComponent.setTitleClickHandler(onTitleFilmClick);
    filmCardComponent.setPosterClickHandler(onPosterFilmClick);
    filmCardComponent.setCommentsClickHandler(onCommentsFilmClick);

    document.removeEventListener(`keydown`, onEscapeClosePopupDown);
  };
  const addListenerCloseOnElementsFilmCard = () => {
    popupDetailFilmComponent.setCloseClickHandler(onButtonClosePopupFilmDetail);
    document.addEventListener(`keydown`, onEscapeClosePopupDown);
  };

  const onTitleFilmClick = () => {
    showPopupFilm();

    addListenerCloseOnElementsFilmCard();

    filmCardComponent.removeTitleClickHandler(onPosterFilmClick);
    filmCardComponent.removePosterClickHandler(`click`, onCommentsFilmClick);
  };
  const onPosterFilmClick = () => {
    showPopupFilm();

    addListenerCloseOnElementsFilmCard();

    filmCardComponent.removeTitleClickHandler(onTitleFilmClick);
    filmCardComponent.removeCommentsClickHandler(onCommentsFilmClick);
  };
  const onCommentsFilmClick = () => {
    showPopupFilm();

    addListenerCloseOnElementsFilmCard();

    filmCardComponent.removeTitleClickHandler(onTitleFilmClick);
    filmCardComponent.removePosterClickHandler(onPosterFilmClick);
  };
  const onButtonClosePopupFilmDetail = () => {
    closePopupFilm();

    addListenerOpenOnElementsFilmCard();

    popupDetailFilmComponent.removeCloseClickHandler(onButtonClosePopupFilmDetail);
  };
  const onEscapeClosePopupDown = (evt) => {
    const isEscape = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscape) {
      closePopupFilm();

      addListenerOpenOnElementsFilmCard();
    }
  };

  addListenerOpenOnElementsFilmCard();

  render(filmsList, filmCardComponent);
};

const getFilmsTopRated = (allFilms, count) => {
  return allFilms.slice().sort((filmCurrent, filmNext) => {
    return Number(filmNext.filmInfo.totalRating) - Number(filmCurrent.filmInfo.totalRating);
  }).slice(0, count);
};
const getFilmsMostCommented = (allFilms, count) => {
  return allFilms.slice().sort((filmCurrent, filmNext) => {
    return filmNext.comments.length - filmCurrent.comments.length;
  }).slice(0, count);
};

export default class Page {
  constructor(container, films, filters, sorts) {
    this._container = container;
    this._films = films;
    this._filmsDefault = films.slice();

    this._filtersComponent = new FiltersComponent(filters);
    this._sortsComponent = new SortsComponent(sorts);
  }

  render() {
    render(this._container, this._filtersComponent);
    render(this._container, this._sortsComponent);

    const onSortButtonClick = (evt) => {
      if (!evt.target.classList.contains(`sort__button--active`)) {
        const sortName = evt.target.dataset.sortName;
        startShowCardsLoad = 0;

        this._films = sortingFilms(this._films, this._filmsDefault, sortName);

        this._sortsComponent.removeActiveButton();
        evt.target.classList.add(`sort__button--active`);
        filmListMain.innerHTML = ``;
        renderMainFilmCards(this._films, filmListMain);
      }
    };

    this._sortsComponent.setSortButtonClickHandler(onSortButtonClick);

    if (!this._films.length) {
      const mainBlockForFilmsComponent = renderMainBlockForFilms(this._container);
      render(mainBlockForFilmsComponent.getElement(), new NoFilmsComponent().getElement());
      return;
    }

    const filmsBlockComponent = renderMainBlockForFilms(this._container);
    const filmsListMainComponent = renderAllFilmsBlock(filmsBlockComponent.getElement());
    const filmsListTopComponent = renderTopFilmsBlock(filmsBlockComponent.getElement());
    const filmsListMostCommentComponent = renderMostCommentFilmsBlock(filmsBlockComponent.getElement());

    const buttonShowMoreComponent = renderShowMoreButton(filmsListMainComponent.getElement());

    const filmRatedCards = getFilmsTopRated(this._films, FILMS_TOP_RATED);
    const filmMostCommentedCards = getFilmsMostCommented(this._films, FILMS_MOST_COMMENTED);

    const filmListMain = filmsListMainComponent.getElement().querySelector(`.films-list__container`);
    const filmListTop = filmsListTopComponent.getElement().querySelector(`.films-list__container`);
    const filmListMostComment = filmsListMostCommentComponent.getElement()
      .querySelector(`.films-list__container`);
    renderMainFilmCards(this._films, filmListMain);
    renderTopFilmCards(filmRatedCards, filmListTop);
    renderMostCommentListCards(filmMostCommentedCards, filmListMostComment);

    const onButtonShowMoreClick = () => {
      renderMainFilmCards(this._films, filmListMain);

      if (startShowCardsLoad >= this._films.length) {
        buttonShowMoreComponent.removeClickHandler(onButtonShowMoreClick);
        remove(buttonShowMoreComponent);
      }
    };
    buttonShowMoreComponent.setClickHandler(onButtonShowMoreClick);
  }
}
