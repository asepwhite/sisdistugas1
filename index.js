const express = require('express')
const app = express()
const fs = require('fs')
const request = require('request');
const rp = require('request-promise');
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json();
const Sequelize = require('sequelize');
const sequelize = new Sequelize('sisdis', 'root', 'rootroot', {
  host: 'localhost',
  dialect: 'mysql'
});

const User = sequelize.define('users', {
  npm: { type: Sequelize.INTEGER,  unique: true },
  nama: Sequelize.STRING,
  saldo: Sequelize.INTEGER
});

// app.get('/createUser', function(req, res){
//   sequelize.sync()
//   .then(() => User.create({
//     npm: 1406623064,
//     nama: 'akbar',
//     saldo: 0
//   }))
// });

app.post('/ewallet/ping', function(req, res){
  responseObject = {};
  responseObject.pong = 1;
  res.send(responseObject);
});

app.get('/hello', function(req, res){
  console.log('hello');
});

app.post('/ewallet/register', jsonParser, function(req, res){
    var responseObject = {};
    responseObject.status_register = 0;
    try {
      if((req.body.user_id && req.body.nama)){
          sequelize.sync().then(function(){
            User.create({
              npm: req.body.user_id,
              nama: req.body.nama,
              saldo: 0
            }).then(function(){
              register.status_register = 1;
              res.send(responseObject);
            }).catch(function(err){
              responseObject.status_register = 4;
              res.status(400).send(responseObject);
            });
          }).catch(function(err){
            responseObject.status_register = 4;
            res.status(400).send(responseObject);
          });
      } else {
        responseObject.status_register = 99;
        res.status(400).send(responseObject);
      }
    } catch(e) {
      console.log(e);
    }
});

app.post('/ewallet/getSaldo', jsonParser, function(req, res){
    var responseObject = {};
    responseObject.status_register = 0;
    try {
      if((req.body.user_id)){
          sequelize.sync().then(function(){
            // Project.findOne({ where: {user_id : 'aProject'} }).then(project => {
            // })
            User.create({
              npm: req.body.user_id,
              nama: req.body.nama,
              saldo: 0
            }).then(function(){
              register.status_register = 1;
              res.send(responseObject);
            }).catch(function(err){
              responseObject.status_register = 4;
              res.status(400).send(responseObject);
            });
          }).catch(function(err){
            responseObject.status_register = 4;
            res.status(400).send(responseObject);
          });
      } else {
        responseObject.status_register = 99;
        res.status(400).send(responseObject);
      }
    } catch(e) {
      console.log(e);
    }
});

app.get('/list', function(req, res){
  var options = {
   root: __dirname,
 };
  res.sendFile('listip.json', options);
});

function checkQuorum(){
  var successPing = 0;
  var totalPing = 0;
  var jobs = [];
  var job = "";
  var options = {
    method: 'GET',
    uri: 'http://127.0.0.1:3000/list',
    body: {},
    json: true // Automatically stringifies the body to JSON
 };
 var job = "";

 return rp(options).then(function(body){
  //call other student ping service asynchronously
   try {
     arrayOfIP = body;
     options.method = 'POST';
     for (var index in arrayOfIP) {
       pairNpmIp = arrayOfIP[index];
       if(pairNpmIp.npm === '1406578275'){
         options.uri = 'http://127.0.0.1:3000/ewallet/ping';
         job = rp(options).then(function (body) {
              if(body.pong === 1){
                successPing += 1;
              }
         }).catch(function (err) {});
         jobs.push(job);
         totalPing+= 1;
       } else if (pairNpmIp.npm === '1406543813') {
         options.uri = 'http://127.0.0.1:3000/ewallet/ping';
         job = rp(options).then(function (body) {
              if(body.pong === 1){
                successPing += 1;
              }
         }).catch(function (err) {});
         jobs.push(job);
         totalPing+= 1;
       } else if (pairNpmIp.npm === '1406543832') {
         options.uri = 'http://127.0.0.1:3000/ewallet/ping';
         job = rp(options).then(function (body) {
              if(body.pong === 1){
                successPing += 1;
              }
         }).catch(function (err) {});
         jobs.push(job);
         totalPing+= 1;
       }
     }
     //call self ping
     job = rp(options).then(function (body) {
          if(body.pong === 1){
            successPing += 1;
          }
     }).catch(function (err) {});
     totalPing+= 1;
     jobs.push(job);

     return Promise.all(jobs).then(function(){
       var resultObject = {}
       resultObject.successPing = successPing;
       resultObject.totalPing = totalPing;
       return Promise.resolve(resultObject);
     });

   } catch(e) {
     console.log(e);
   }
 }).catch(function (err) {});
}

app.get('/ewallet/checkQuorum', function(req, res){
  checkQuorum().then(function(result){
    res.send(result);
  });
});

app.listen(3000, function () {
  console.log('App running on port 3000!'+"\n")
})
