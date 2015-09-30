'use strict';

const express = require('express');
const {keyTap} = require('robotjs');
const path = require('path');
const win32ole = require('win32ole');

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

app.get('/status', (req, res) => {
  let iTunesApp = win32ole.client.Dispatch('iTunes.Application');
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
    };
  }

  res.json({
    playerState: iTunesApp.PlayerState(),
    currentTrack: currentTrack,
  });
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
