require('dotenv').config();
const express = require('express');

const usersRoute = require('./routes/usersRoute');
const newsRoute = require('./routes/newsRoute');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', usersRoute);
app.use('/news', newsRoute);

app.get('/', (_req, res) => res.send('Server running'));

module.exports = app;