const express = require('express');
const routes = require('./routes.js')
var cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());
app.use('/api', routes);

app.listen(3001);
console.log("Backend is running");