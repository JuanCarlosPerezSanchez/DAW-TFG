export default class HomePageDTO {
    constructor() {
        this.items = [];
        this.page = 1;
        this.loading = false;
        this.error = null;
        this.hasMore = true;
    }

    setItems(items) {
        this.items = items;
    }

    addItems(items) {
        this.items = [...this.items, ...items];
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
