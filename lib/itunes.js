'use strict';

const {ITunesActions} = require('./constants');
const osa = require('osa');

let iTunesApp;
try {
  const win32ole = require('win32ole');
  iTunesApp = win32ole.client.Dispatch('iTunes.Application');
} catch (e) {
  console.log('could not load win32 API');
}

let itunes = {};
if (iTunesApp) {
  itunes = {
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
        track.set('Rating', rating);
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
          return true;
        case ITunesActions.VOLUME_DOWN:
          return true;
        case ITunesActions.VOLUME_UP:
          return true;
        default:
          return false;
      }
    },
  };
} else {
  /* eslint no-var:0, no-shadow:0, no-undef:0 */

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

  itunes = {
    async getPlayerState() {
      return osaPromise(() => {
        var itunes = Application('iTunes');
        return itunes.playerState() == 'playing';
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
}

module.exports = itunes;
