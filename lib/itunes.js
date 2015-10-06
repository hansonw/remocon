'use strict';

const {ITunesActions} = require('./constants');
const os = require('os');

if (os.platform() === 'win32') {
  const win32ole = require('win32ole');
  const iTunesApp = win32ole.client.Dispatch('iTunes.Application');
  module.exports = {
    async getPlayerState() {
      return iTunesApp.PlayerState();
    },

    async getCurrentTrack() {
      let track = iTunesApp.CurrentTrack();
      if (track) {
        let artwork = track.Artwork.Item(1);
        if (artwork) {
          artwork = artwork.Description();
        }
        return {
          name: track.Name() || 'Untitled Track',
          artist: track.Artist() || 'Unknown Artist',
          album: track.Album() || 'Unknown Album',
          artwork: artwork,
          currentTime: iTunesApp.PlayerPosition(),
          duration: track.Duration(),
          rating: track.Rating(),
        };
      }
      return null;
    },

    setCurrentTrackRating(rating) {
      let track = iTunesApp.CurrentTrack();
      if (track) {
        track.Rating = rating;
        return true;
      }
      return false;
    },

    handleAction(action) {
      switch (action) {
        case ITunesActions.PLAY_PAUSE:
          iTunesApp.PlayPause();
          return true;
        case ITunesActions.NEXT_TRACK:
          iTunesApp.NextTrack();
          return true;
        case ITunesActions.BACK_TRACK:
          iTunesApp.BackTrack();
          return true;
        case ITunesActions.VOLUME_MUTE:
          iTunesApp.Mute = !iTunesApp.Mute();
          return true;
        case ITunesActions.VOLUME_DOWN:
          iTunesApp.SoundVolume = Math.max(iTunesApp.SoundVolume() - 10, 0);
          return true;
        case ITunesActions.VOLUME_UP:
          iTunesApp.SoundVolume = Math.min(iTunesApp.SoundVolume() + 10, 100);
          return true;
        default:
          return false;
      }
    },
  };
} else if (os.platform() === 'darwin') {
  /* eslint no-var:0, no-shadow:0, no-undef:0 */
  const osa = require('osa');
  const osaPromise = (fn, ...args) => {
    return new Promise((resolve, reject) => {
      osa(fn, ...args, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  };

  module.exports = {
    async getPlayerState() {
      return osaPromise(() => {
        var itunes = Application('iTunes');
        return itunes.playerState() === 'playing';
      });
    },

    async getCurrentTrack() {
      return osaPromise(() => {
        var itunes = Application('iTunes');
        var track = itunes.currentTrack();
        if (!track) {
          return null;
        }
        var artwork = null;
        var artworks = track.artworks();
        if (artworks.length) {
          artwork = artworks[0].data();
          // TODO: this is just <>?
        }
        return {
          name: track.name() || 'Untitled Track',
          artist: track.artist() || 'Unknown Artist',
          album: track.album() || 'Unknown Album',
          artwork: artwork,
          currentTime: itunes.playerPosition(),
          duration: track.duration(),
          rating: track.rating(),
        };
      });
    },

    async setCurrentTrackRating(rating) {
      return osaPromise((rating) => {
        var itunes = Application('iTunes');
        var track = itunes.currentTrack();
        if (track) {
          track.rating = rating;
        }
        return false;
      }, rating);
    },

    handleAction(action) {
      switch (action) {
        case ITunesActions.PLAY_PAUSE:
          osaPromise(() => {
            var itunes = Application('iTunes');
            itunes.playpause();
          });
          return true;
        case ITunesActions.NEXT_TRACK:
          osaPromise(() => {
            var itunes = Application('iTunes');
            itunes.nextTrack();
          });
          return true;
        case ITunesActions.BACK_TRACK:
          osaPromise(() => {
            var itunes = Application('iTunes');
            itunes.backTrack();
          });
          return true;
        case ITunesActions.VOLUME_MUTE:
          osaPromise(() => {
            var itunes = Application('iTunes');
            itunes.mute = !itunes.mute();
          });
          return true;
        case ITunesActions.VOLUME_DOWN:
          osaPromise(() => {
            var itunes = Application('iTunes');
            itunes.soundVolume = Math.max(itunes.soundVolume() - 10, 0);
          });
          return true;
        case ITunesActions.VOLUME_UP:
          osaPromise(() => {
            var itunes = Application('iTunes');
            itunes.soundVolume = Math.min(itunes.soundVolume() + 10, 100);
          });
          return true;
        default:
          return false;
      }
    },
  };
} else {
  throw new Error('Only Windows and Mac OS X are supported.');
}
