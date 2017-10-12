const express = require('express')
const app = express()
const fs = require('fs')
const request = require('request');

app.post('/ewallet/ping', function(req, res){
  responseObject = {};
  responseObject.pong = 1;
  res.send(responseObject);
});

app.get('/hello', function(req, res){
  console.log('hello');
});

app.get('/list', function(req, res){
  var options = {
   root: __dirname,
 };
  res.sendFile('listip.json', options);
});

function checkQuorum(){
  var successPing = 0;
  makePingRequest('http://127.0.0.1:3000/ewallet/ping', function(pingSuccess){
    successPing += pingSuccess;
  });
  request.get('http://127.0.0.1:3000/list', function(error, response, body){
      try{
        listOfIP = JSON.parse(body);
        for (var index in listOfIP) {
          npmIpPair = JSON.parse(listOfIP[index]);
        }
      } catch(e){
        return "error when call list.php";
      }
  })
  // return successPing;
}

function makePingRequest(requestUrl, cb) {
  var pingSuccess = 0;
  return request.post({url:requestUrl, formData:{}}, function(error, response, body){
    try{
      var responseObject = JSON.parse(body);
      if(responseObject.pong === 1){
        pingSuccess = 1;
      }
      cb(1);
    } catch(e){
      return "error when call self ping";
    }
  });
}

app.get('/ewallet/checkQuorum', function(req, res){
  var pingSuccess = checkQuorum();
  res.send(""+pingSuccess);
});

app.listen(3000, function () {
  console.log('App running on port 3000!'+"\n")
})
