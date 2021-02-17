const express = require('express');
const routes = express.Router();
const tradingController = require('./controller/tradingController.js');


routes.get('/trading/', tradingController.getData);



module.exports = routes;