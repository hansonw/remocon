'use strict';

const express = require('express');
const {keyTap} = require('robotjs');
const path = require('path');

const app = express();

const BASEDIR = __dirname + '/../';
const ACTIONS = [
  'playpause',
  'nexttrack',
  'prevtrack',
  'volumedown',
  'volumemute',
  'volumeup',
];

app.get('/', (req, res) => {
  res.sendFile(path.join(BASEDIR + 'html/index.html'));
});

for (let action of ACTIONS) {
  app.post('/' + action, (req, res) => {
    console.log(action);
    keyTap(action);
    res.status(200).end();
  });
}

app.use(express.static(BASEDIR + 'build'));

module.exports = app;
