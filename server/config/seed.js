/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Item = require('../api/item/item.model');
var Order = require('../api/order/order.model');
var User = require('../api/user/user.model');


User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'テストユーザ',
    pronunciation: 'テストユーザ',
    phone: '+81904289xxxx',
    address: '東京都江東区ほにゃららら町1-2-3',
    email: 'test@test.com',
    password: 'test'
  }, {
    provider: 'local',
    role: 'admin',
    name: 'サンプル米屋',
    pronunciation: 'サンプル米屋',
    phone: '+8190xxxxxxxx',
    address: '',
    email: 'admin@admin.com',
    password: 'admin'
  }, function(){
  /*-----------------------------*/

Item.find({}).remove(function() {
  Item.create({
    phone: '+815031596656',
    name: 'コシヒカリ5kg',
    price: 1800
  }, function(){
  /*******************************/

Order.find({}).remove(function() {

  Item.findOne( {phone: '+815031596656'} , function (err, item) {
    User.findOne( {phone: '+81904289xxxx'} , function (err, user) {
      Order.create({
        item: item._id,
        user: user._id,
        quantity: 2,
        state: '未発送'
      },{
        item: item._id,
        user: user._id,
        quantity: 1,
        state: '配送中'
      },{
        item: item._id,
        user: user._id,
        quantity: 2,
        state: '未発送'
      },{
        item: item._id,
        user: user._id,
        quantity: 1,
        state: '配送済'
      },{
        item: item._id,
        user: user._id,
        quantity: 3,
        state: '配送中'
      });
    });
  });

});
  /*******************************/
  });
});
  /*-----------------------------*/
  });
});
