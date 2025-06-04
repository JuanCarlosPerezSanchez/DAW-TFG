export default class SeriesPageDTO {
    constructor() {
        this.series = [];
        this.page = 1;
        this.loading = false;
        this.error = null;
        this.hasMore = true;
    }

    setSeries(series) {
        this.series = series;
    }

    addSeries(series) {
        this.series = [...this.series, ...series];
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
