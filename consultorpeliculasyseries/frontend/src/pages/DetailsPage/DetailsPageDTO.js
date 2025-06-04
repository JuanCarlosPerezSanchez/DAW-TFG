export default class DetailsPageDTO {
    constructor() {
        this.detalle = null;
        this.loading = false;
        this.error = null;
    }

    setDetalle(detalle) {
        this.detalle = detalle;
    }

    setLoading(loading) {
        this.loading = loading;
    }

    setError(error) {
        this.error = error;
    }
}
