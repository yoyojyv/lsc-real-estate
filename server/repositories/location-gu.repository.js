const mongoose = require('mongoose');
const LocationGu = require('../models/location-gu');

class GuRepository {

  async getAll() {
    let guList = await LocationGu.find({})
      .sort({ order: 'asc' });
    return guList;
  }

}

module.exports = new GuRepository();
