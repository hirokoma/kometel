'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var OrderSchema = new Schema({
  item: { type: Schema.Types.ObjectId, ref: 'Item'},
  user: { type: Schema.Types.ObjectId, ref: 'User'},
  quantity: Number,
  state: { type: String, enum: '未発送,配送中,配送済'.split(',') }
});

module.exports = mongoose.model('Order', OrderSchema);
