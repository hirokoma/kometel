'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ItemSchema = new Schema({
  name: String,
  price: Number,
  phone: String
});

module.exports = mongoose.model('Item', ItemSchema);
