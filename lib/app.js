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
    let volume = await itunes.getVolume();
    res.json({
      isPlaying: currentState,
      currentTrack: currentTrack,
      volume: volume,
    }).end();
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});

app.get('/artwork', async (req, res) => {
	try {
		let artwork = await itunes.getCurrentTrackArtwork();
		res.json(artwork).end();
	} catch (err) {
		console.log(err);
		res.status(500).end();
	}
});

app.post('/rate', (req, res) => {
  let rating = parseInt(req.query.rating, 10);
  if (!isNaN(rating)) {
    itunes.setCurrentTrackRating(rating);
    res.status(200).end();
  }
});

app.post('/position', (req, res) => {
  let position = parseInt(req.query.position, 10);
  if (!isNaN(position)) {
    itunes.setPlayerPosition(position);
    res.status(200).end();
  }
});

app.post('/volume', (req, res) => {
  let volume = parseInt(req.query.volume, 10);
  if (!isNaN(volume)) {
    itunes.setVolume(volume);
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
app.use(express.static(BASEDIR + 'static'));

module.exports = app;
