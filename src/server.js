
require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json({limit: '2mb'}));
app.use(routes);

mongoose.connect(process.env.MONGO_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
})
.then(() => { console.log("DB connected"); })
.catch((err) => console.log(err));

module.exports = app;