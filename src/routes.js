const express = require('express');
const routes = express.Router();
const tradingController = require('./controller/tradingController.js');


routes.get('/trading/:ticker/:timeframe/:range', tradingController.getData);



module.exports = routes;