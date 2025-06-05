export default class SearchResultsPageDTO {
    constructor() {
        this.results = [];
        this.loading = false;
        this.error = null;
        this.filter = "all";
    }
}
