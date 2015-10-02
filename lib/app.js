'use strict';

const {ITunesActions} = require('./constants');
const express = require('express');
const {keyTap} = require('robotjs');
const path = require('path');
const win32ole = require('win32ole');

const app = express();
const iTunesApp = win32ole.client.Dispatch('iTunes.Application');

const BASEDIR = __dirname + '/../';
const ACTIONS = Object.keys(ITunesActions)
  .map(x => ITunesActions[x])
  .concat([
    'volumedown',
    'volumemute',
    'volumeup',
  ]);

app.get('/', (req, res) => {
  res.sendFile(path.join(BASEDIR + 'html/index.html'));
});

app.get('/status', (req, res) => {
  let currentTrack = null;
  let track = iTunesApp.CurrentTrack();
  if (track) {
    let artwork = track.Artwork.Item(1);
    if (artwork) {
      artwork = artwork.Description();
    }
    currentTrack = {
      name: track.Name() || 'Untitled Track',
      artist: track.Artist() || 'Unknown Artist',
      album: track.Album() || 'Unknown Album',
      artwork: artwork,
      currentTime: iTunesApp.PlayerPosition(),
      duration: track.Duration(),
      rating: track.Rating(),
    };
  }

  res.json({
    isPlaying: iTunesApp.PlayerState(),
    currentTrack: currentTrack,
  });
});

app.post('/rate', (req, res) => {
  let rating = Number.parseInt(req.query.rating);
  if (!Number.isNaN(rating)) {
    let track = iTunesApp.CurrentTrack();
    if (track) {
      console.log(rating);
      track.set('Rating', rating);
    }
    res.status(200).end();
  }
});

for (let action of ACTIONS) {
  app.post('/' + action, (req, res) => {
    console.log(action);
    switch (action) {
      case ITunesActions.PLAY_PAUSE:
        iTunesApp.PlayPause();
        break;
      case ITunesActions.NEXT_TRACK:
        iTunesApp.NextTrack();
        break;
      case ITunesActions.BACK_TRACK:
        iTunesApp.BackTrack();
        break;
      default:
        keyTap(action);
    }
    res.status(200).end();
  });
}

app.use(express.static(BASEDIR + 'build'));

module.exports = app;
