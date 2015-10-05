'use strict';

const express = require('express');
const path = require('path');
const itunes = require('./itunes');

const app = express();

const BASEDIR = __dirname + '/../';

app.get('/', (req, res) => {
  res.sendFile(path.join(BASEDIR + 'html/index.html'));
});

app.get('/status', async (req, res) => {
  try {
    let currentTrack = await itunes.getCurrentTrack();
    let currentState = await itunes.getPlayerState();
    res.json({
      isPlaying: currentState,
      currentTrack: currentTrack,
    }).end();
  } catch (err) {
    console.log(err);
    res.status(500).end();
  };
});

app.post('/rate', (req, res) => {
  let rating = parseInt(req.query.rating, 10);
  if (!isNaN(rating)) {
    itunes.setCurrentTrackRating(rating);
    res.status(200).end();
  }
});

app.post('/action/:action', (req, res) => {
  let {action} = req.params;
  console.log(action);
  if (itunes.handleAction(action)) {
    return res.status(200).end();
  }
  return res.status(500).end();
});

app.use(express.static(BASEDIR + 'build'));

module.exports = app;
