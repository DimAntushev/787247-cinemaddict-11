export default class FilmAdapter {
  constructor(data) {
    this.comments = data[`comments`];
    this.id = data[`id`];
    this.filmInfo = {
      actors: data[`film_info`][`actors`],
      ageRating: data[`film_info`][`age_rating`],
      totalRating: data[`film_info`][`total_rating`],
      alternativeTitle: data[`film_info`][`alternative_title`],
      description: data[`film_info`][`description`],
      director: data[`film_info`][`director`],
      genre: data[`film_info`][`genre`],
      poster: data[`film_info`][`poster`],
      release: {
        date: data[`film_info`][`release`][`date`],
        releaseCountry: data[`film_info`][`release`][`release_country`]
      },
      runtime: data[`film_info`][`runtime`],
      title: data[`film_info`][`title`],
      writers: data[`film_info`][`writers`],
      id: data[`film_info`][`id`]
    };
    this.userDetails = {
      alreadyWatched: data[`user_details`][`already_watched`],
      favorite: data[`user_details`][`favorite`],
      watchingDate: data[`user_details`][`watching_date`],
      watchlist: data[`user_details`][`watchlist`]
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
    // console.log(film);
    return new FilmAdapter(film);
  }

  static parseFilms(films) {
    return films.map(FilmAdapter.parseFilm);
  }

  static clone(film) {
    return new FilmAdapter(film.toRAW());
  }
}
