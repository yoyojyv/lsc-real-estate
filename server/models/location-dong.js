const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var LocationGu = require('./location-gu');

const schema = new Schema({
  gu: { type: Schema.Types.ObjectId, ref: 'LocationGu' },
  name: { type: String, required: true, trim: true },
  order: { type: Number, required: false },
});

module.exports = mongoose.model('LocationDong', schema, 'locationDong');
