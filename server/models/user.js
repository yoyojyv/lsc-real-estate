const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseUniqueValidator = require('mongoose-unique-validator');

const schema = new Schema({
  username: { type: String, required: true, trim: true, unique: true },
  password: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  mainPhone: { type: String, required: true, trim: true },
  userPhone: { type: String, required: true, trim: true },
  role: { type: String, required: true, trim: true },
  deleted: { type: Boolean, required: false, default: false },
  created: { type: Date, required: true },
  deleteYn: { type: String, required: false, default: 'N' },
});

schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('User', schema, 'users');
