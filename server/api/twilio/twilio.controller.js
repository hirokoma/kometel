'use strict';

var _ = require('lodash');
var Twilio = require('./twilio.model');
var User = require('./../user/user.model');
var Order = require('./../order/order.model');
var Item = require('./../item/item.model');
var tw = require('twilio');
var accountSid = 'AC41ed205318adbd699f14dec28abccaa1';
var authToken = 'd077518f01a9a63900f3bc0756ebb702';
var client = tw(accountSid, authToken);
var http = require('http');
var VoiceText = require('voicetext');
var fs = require('fs');
var voice = new VoiceText('4xw0u92bj224wh14');
var hikari = voice.speaker(voice.SPEAKER.HARUKA);

exports.hello = function (req, res) {
    var resp = new tw.TwimlResponse();
    var name;
    console.log(req.query);
    User.findOne({ phone: req.query.From }, function(err, user){
      if(user){
        hikari.speak('こんにちは、' + user.pronunciation + 'さん。魚沼産コシヒカリ5キログラムを何袋注文しますか? 個数を入力してシャープを押してください。', function(e, buf){
          fs.writeFile('./client/assets/audios/hello.wav', buf, 'binary', function(e){
            resp.gather({
              action: 'http://157.7.85.233:9000/api/twilios/' + user._id + '/order/',
              method: 'GET',
              finishOnKey: '#',
              timeout: 20
            }, function(){
              this.play('http://157.7.85.233:9000/assets/audios/hello.wav');
            });
            res.writeHead(200, {'Content-Type': 'text/xml'});
            res.end(resp.toString());
          });
        });
      }else{
        hikari.speak('こちらは、コメテルです。', function(e, buf){
          fs.writeFile('./client/assets/audios/who.wav', buf, 'binary', function(e){
            resp.play('http://157.7.85.233:9000/assets/audios/who.wav')
                .dial({
                  action:'http://210.140.162.140/twilio/dialer/index.php'
                });
            res.writeHead(200, {'Content-Type': 'text/xml'});
            res.end(resp.toString());
          });
        });
      }
    });
};


exports.register = function (req, res) {
    var resp = new tw.TwimlResponse();
    console.log(req.query);
    User.create({
      name: req.query.Name,
      pronunciation: req.query.Name,
      phone: req.query.From,
      address: req.query.Address,
      email: 'test@test.com' + Math.random().toString(36).slice(2),
      password: 'test@test.com' + Math.random().toString(36).slice(2)
    }, function(err, user){
      if(err) { return handleError(res, err); }

        hikari.speak('こんにちは、' + user.name + 'さん。コシヒカリ5キログラムを何袋注文しますか? 個数を入力してシャープを押してください。', function(e, buf){
          fs.writeFile('./client/assets/audios/hello.wav', buf, 'binary', function(e){
            resp.gather({
              action: 'http://157.7.85.233:9000/api/twilios/' + user._id + '/order/',
              method: 'GET',
              finishOnKey: '#',
              timeout: 20
            }, function(){
              this.play('http://52.68.100.246:9000/assets/audios/hello.wav');
            });
            res.writeHead(200, {'Content-Type': 'text/xml'});
            res.end(resp.toString());
          });
        });

/*
      hikari.speak('ありがとうございました。', function(e, buf){
        fs.writeFile('./client/assets/audios/register.wav', buf, 'binary', function(e){
          resp.play('http://52.68.100.246:9000/assets/audios/register.wav')
              .redirect('http://52.68.100.246:9000/api/twilios/hello');
          res.writeHead(200, {'Content-Type': 'text/xml'});
          res.end(resp.toString());
        });
      });
*/
    });
};

exports.order = function (req, res) {
    var pushNumber = req.query.Digits;
    var resp = new tw.TwimlResponse();
    User.findById(req.params.id, function(err, user){
      Item.findOne({phone:'+815031596656'}, function(err, item){
        Order.create({
            item: item._id,
            quantity: pushNumber,
            user: user._id,
            state: '未発送'
          }, function(err, order){
          if(err) { return handleError(res, err); }
          hikari.speak(pushNumber + '個承りました。ありがとうございました。', function(e, buf){
            fs.writeFile('./client/assets/audios/thank.wav', buf, 'binary', function(e){
              resp.play('http://157.7.85.233:9000/assets/audios/thank.wav');
              res.writeHead(200, {'Content-Type': 'text/xml'});
              res.end(resp.toString());
            });
          });
        });
      });
    });
};

function handleError(res, err) {
  return res.send(500, err);
}
