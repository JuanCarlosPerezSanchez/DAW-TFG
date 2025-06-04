export default class GaleriPageDTO {
    constructor() {
        this.items = [];
        this.allItems = [];
        this.page = 1;
        this.loading = false;
        this.error = null;
        this.hasMore = false;
    }
}
