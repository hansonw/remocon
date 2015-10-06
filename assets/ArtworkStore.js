const alt = require('./alt');
const rest = require('./rest');
const PlayerStore = require('./PlayerStore');

class ArtworkStore {
  constructor() {
    this.trackArtwork = {};
    PlayerStore.listen(this.handlePlayerUpdate.bind(this));
  }

  handlePlayerUpdate(newState) {
    let {currentTrack} = newState.playerState;
    if (currentTrack) {
      let {hasArtwork, id} = currentTrack;
      if (hasArtwork && !this.trackArtwork[id]) {
        rest('/artwork').then(resp => {
          let artwork = resp.entity;
          if (artwork) {
            this.trackArtwork[artwork.trackID] = artwork;
            this.emitChange();
          }
        });
      }
    }
    return false;
  }
}

module.exports = alt.createStore(ArtworkStore, 'ArtworkStore');
