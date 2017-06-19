const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseUniqueValidator = require('mongoose-unique-validator');

const schema = new Schema({
  name: { type: String, required: true, trim: true, unique: true },
  order: { type: Number, required: false },
});

schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('LocationGu', schema, 'locationGu');
