
const https = require('https');

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const fs = require('fs');

const options = {
  key: fs.readFileSync('./ssl/ezroad.co.kr.key.pem'),
  cert: fs.readFileSync('./ssl/ezroad.co.kr.crt.pem')
};

// Other settings
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(function (req, res, next) { // 1
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'content-type');
  next();
});

// API 
app.use('/vote_predict', require('./api/vote_predic'));
//console.log("Compute is : " + compute);


// Create an HTTPS service identical to the HTTP service.
https.createServer(options, app).listen(3000);
