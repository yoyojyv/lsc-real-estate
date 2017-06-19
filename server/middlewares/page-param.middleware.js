module.exports = () => {

  const pageParamMiddleware = (req, res, next) => {
    let sortParams = [];
    if (req.query.sort) {
      sortParams = sortParams.concat(req.query.sort);
    }

    let sort = [];
    for (let oneSort of sortParams) {
      let sortTemp = oneSort.split(',');
      let property = sortTemp[0].trim();
      let direction = sortTemp[1].trim();
      sort.push([property, direction]);
    }

    req.pageParam = {
      page: req.query.page,
      limit: req.query.limit,
      sort: sort,
      search: req.query.search,
    };
    next();
  };

  return pageParamMiddleware;

};
