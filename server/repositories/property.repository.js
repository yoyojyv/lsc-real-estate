const mongoose = require('mongoose');
const RealProperty = require('../models/real-property');


class PropertyRepository {

  async getPagedProperties(pageParam) {

    let search = { deleteYn: 'N' };
    if (pageParam.search) {
      let like = { $regex: '.*' + pageParam.search + '.*' };
      search = {
        deleteYn: 'N',
        $and: [
          { deleteYn: 'N' },
          {
            $or: [
              { title: like },
              { address1: like },
            ],
          },
        ],
      };
    }

    let totalElements = await RealProperty.count(search);

    let skip = (pageParam.page - 1) * pageParam.limit;
    let limit = pageParam.limit;
    let sort = pageParam.sort.length < 1 ? [['no', 'desc']] : pageParam.sort;

    let content = await RealProperty.find(search, {
      address2: false,
      remarks: false,
      monthlyRevenue: false,
      monthlyRent: false,
    })
      .populate('personInCharge', ['-password'])
      .sort(sort)
      .skip(skip)
      .limit(limit);

    let totalPages = Math.ceil(totalElements / limit);
    return { totalElements, content, totalPages };
  }

  async getPropertyShort(id) {
    let property = await RealProperty.findById(id, {
      address2: false,
      remarks: false,
      monthlyRevenue: false,
      monthlyRent: false,
    })
      .populate('personInCharge', ['-password']);
    return property;
  }

  async getPropertyDetail(id) {
    let property = await RealProperty.findById(id)
      .populate('personInCharge', ['-password']);
    return property;
  }

  async updateToRemoved(id) {
    let result = false;
    let update = await RealProperty.update({ _id: id }, {
      deleteYn: 'Y',
    });
    if (update.ok) {
      result = true;
    }

    return result;
  }

  async saveProperty(property) {
    let result = false;
    if (!property._id) {
      let insert = await (new RealProperty(property)).save();
      if (insert._id) {
        result = true;
      }
    } else {
      let update = await RealProperty.update({ _id: property._id }, { $set: property });
      if (update.ok) {
        result = true;
      }
    }

    return result;
  }

}

module.exports = new PropertyRepository();
