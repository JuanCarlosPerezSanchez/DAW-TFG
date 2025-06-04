export default class MoviesPageDTO {
    constructor() {
        this.movies = [];
        this.page = 1;
        this.loading = false;
        this.error = null;
        this.hasMore = true;
    }

    setMovies(movies) {
        this.movies = movies;
    }

    addMovies(movies) {
        this.movies = [...this.movies, ...movies];
    }

    setPage(page) {
        this.page = page;
    }

    setLoading(loading) {
        this.loading = loading;
    }

    setError(error) {
        this.error = error;
    }

    setHasMore(hasMore) {
        this.hasMore = hasMore;
    }
}
