const mongoose = require('mongoose');
const User = require('../models/user');

class UserRepository {

  async getPagedUsers(pageParam) {

    let totalElements = await User.count();

    let skip = (pageParam.page - 1) * pageParam.limit;
    let limit = pageParam.limit;

    let sort = pageParam.sort.length < 1 ? [['created', 'desc']] : pageParam.sort;

    let content = await User.find({ deleteYn: 'N' }, { password: false })
      .sort(sort)
      .skip(skip)
      .limit(limit);

    let totalPages = Math.ceil(totalElements / limit);
    return { totalElements, content, totalPages };
  }

  async getUser(id) {
    let user = await User.findById(id, { password: false });
    return user;
  }

  async updateToRemoved(id) {
    let result = false;
    let update = await User.update({ _id: id }, {
      deleteYn: 'Y',
      deleted: new Date(),
    });
    if (update.ok) {
      result = true;
    }

    return result;
  }

  async saveUser(user) {

    let result = false;
    if (!user._id) {
      let insert = await (new User(user)).save();
      if (insert._id) {
        result = true;
      }
    } else {
      let update = await User.update({ _id: user._id }, { $set: user });
      if (update.ok) {
        result = true;
      }
    }

    return result;
  }

  async findUserByUsername(username) {
    let user = await User.findOne({ username: username }, { password: false });
    return user;
  }

  async findUserIncludePasswordByUsername(username) {
    let user = await User.findOne({ username: username });
    return user;
  }

}

module.exports = new UserRepository();
