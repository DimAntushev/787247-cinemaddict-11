export default class FilmAdapter {
  constructor(film) {
    this.comments = film[`comments`];
    this.id = film[`id`];
    this.filmInfo = {
      actors: film[`film_info`][`actors`],
      ageRating: film[`film_info`][`age_rating`],
      totalRating: film[`film_info`][`total_rating`],
      alternativeTitle: film[`film_info`][`alternative_title`],
      description: film[`film_info`][`description`],
      director: film[`film_info`][`director`],
      genre: film[`film_info`][`genre`],
      poster: film[`film_info`][`poster`],
      release: {
        date: film[`film_info`][`release`][`date`],
        releaseCountry: film[`film_info`][`release`][`release_country`]
      },
      runtime: film[`film_info`][`runtime`],
      title: film[`film_info`][`title`],
      writers: film[`film_info`][`writers`],
      id: film[`film_info`][`id`]
    };
    this.userDetails = {
      alreadyWatched: film[`user_details`][`already_watched`],
      favorite: film[`user_details`][`favorite`],
      watchingDate: film[`user_details`][`watching_date`],
      watchlist: film[`user_details`][`watchlist`]
    };
  }

  toRAW() {
    return {
      "comments": this.comments,
      "film_info": {
        "actors": this.filmInfo.actors,
        "age_rating": this.filmInfo.ageRating,
        "total_rating": this.filmInfo.totalRating,
        "alternative_title": this.filmInfo.alternativeTitle,
        "description": this.filmInfo.description,
        "director": this.filmInfo.director,
        "genre": this.filmInfo.genre,
        "poster": this.filmInfo.poster,
        "release": {
          "date": this.filmInfo.release.date,
          "release_country": this.filmInfo.release.releaseCountry
        },
        "runtime": this.filmInfo.runtime,
        "title": this.filmInfo.title,
        "writers": this.filmInfo.writers,
      },
      "id": this.id,
      "user_details": {
        "already_watched": this.userDetails.alreadyWatched,
        "favorite": this.userDetails.favorite,
        "watching_date": this.userDetails.watchingDate,
        "watchlist": this.userDetails.watchlist
      }
    };
  }

  static parseFilm(film) {
    return new FilmAdapter(film);
  }

  static parseFilms(films) {
    return films.map(FilmAdapter.parseFilm);
  }

  static clone(film) {
    return new FilmAdapter(film.toRAW());
  }
}
