class APIFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        const value = this.queryStr.value ? {
            name: {
                $regex: this.queryStr.value,
                $options: 'i'
            }
        } : {}

        this.query = this.query.find({ ...value });
        return this;
    }

    filter() {
        const { status } = this.queryStr;
        if (status) {
            this.query = this.query.find({ status });
        }
        return this;
    }


    pagination(resPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resPerPage * (currentPage - 1);

        this.query = this.query.limit(resPerPage).skip(skip);
        return this;
    }

}
export default APIFeatures;