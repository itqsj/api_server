class APIFeatures {
    // mongoose query, req query
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        const queryObj = { ...this.queryString };
        // delete specific field
        const excludeFields = ['sort', 'fields', 'page', 'pageSize'];
        excludeFields.forEach((el) => delete queryObj[el]);

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(
            /\b(gte|gt|lte|lt)\b/,
            (match) => `$${match}`,
        );

        this.query.find(JSON.parse(queryStr));

        return this;
    }

    sort(key = -1) {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort({ createdAt: key });
        }

        return this;
    }

    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }

        return this;
    }

    paginate() {
        const pageIndex = this.queryString.page * 1 || 1;
        const pageSize = this.queryString.pageSize * 1 || 10;
        const skip = (pageIndex - 1) * pageSize;
        this.query = this.query.skip(skip).limit(pageSize);

        return this;
    }

    population(field) {
        this.query = this.query.populate(field);

        return this;
    }
}

module.exports = APIFeatures;
