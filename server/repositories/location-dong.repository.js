const mongoose = require('mongoose');
const LocationDong = require('../models/location-dong');

class DongRepository {

  async getAllByGuId(guId) {

    let dongList = await LocationDong.find({ gu: guId }, { password: false })
      .sort({ order: 'asc' });

    return dongList;
  }

}

module.exports = new DongRepository();
