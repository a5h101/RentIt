//Class to create methods
class APIFeatures {
  constructor(query, queryString) {
    this.query = query; //this will be used to chain queries
    this.queryString = queryString; //query given by client
  }

  filter() {
    // if (this.queryString.filter)
    //   this.query = this.query.find({ type: this.queryString.filter });
    // return this;

    //This caan filter based on any given feild but mainly used for type filed
    const queryOb = { ...this.queryString };
    const excludedFields = ['sort', 'search']; //exclude keywords
    excludedFields.forEach((el) => delete queryOb[el]);

    //Advance filtering
    let queryStr = JSON.stringify(queryOb);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); //used to attach gt gte lt lte on request which will bt used by mongoose to sort

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  search() {
    if (this.queryString.search) {
      const searchTerm = this.queryString.search.trim().replace(/[\\\\/]/g, ''); //added replace method to remove backshash from search term as it gives error while creating regex
      const searchRegex = new RegExp(searchTerm, 'i');
      const searchQuery = {
        $or: [
          { product: { $regex: searchRegex } },
          { description: { $regex: searchRegex } },
        ],
      };
      this.query = this.query.find(searchQuery);
    }
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' '); //To attach multiple feilds to sort, usefull to break ties
      this.query = this.query.sort(sortBy);
    } else this.query = this.query.sort('-createdAt');
    return this;
  }
}

module.exports = APIFeatures;
