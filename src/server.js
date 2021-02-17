const express = require('express');
const routes = require('./routes.js')

const app = express();
app.use(express.json());

app.use('/api', routes);

app.listen(80);
console.log("Backend is running");