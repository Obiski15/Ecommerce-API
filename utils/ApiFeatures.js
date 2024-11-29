class ApiFeatures {
  constructor(query, searchParams) {
    this.searchParams = searchParams;
    this.query = query;
  }

  sort() {
    if (this.searchParams.sort) {
      const sortString = this.searchParams.sort.replace(/,/g, " ");
      this.query = this.query.sort(sortString);
    }
    return this;
  }

  paginate() {
    if (this.searchParams.limit && this.searchParams.page) {
      const { limit, page } = this.searchParams;

      this.query = this.query.skip((page - 1) * limit).limit(+limit);
    }

    return this;
  }

  priceRange() {
    if (this.searchParams.price) {
      const [min, max] = this.searchParams.price.split("-");

      this.query = this.query.where({ price: { $gte: +min, $lte: +max } });
    }
    return this;
  }

  getItemsByCategory() {
    if (this.searchParams.category_id) {
      this.query = this.query.where({
        categories: {
          $in: [
            ...this.searchParams.category_id
              .toLowerCase()
              .replace(/-/g, " ")
              .split(","),
          ],
        },
      });
    }

    return this;
  }
}

module.exports = ApiFeatures;
