const alt = require('./alt');
const {ITunesActions} = require('../lib/constants');
const PlayerActions = require('./PlayerActions');

class PlayerStore {
  constructor() {
    this.playerState = {};

    this.bindListeners({
      handleUpdateState: [PlayerActions.LOAD_STATE],
      handleButtonPress: [PlayerActions.PRESS_BUTTON],
      handleRate: [PlayerActions.RATE_CURRENT_SONG],
      handleSetPosition: [PlayerActions.SET_POSITION],
      handleSetVolume: [PlayerActions.SET_VOLUME],
    });
  }

  handleUpdateState(state) {
    this.playerState = state;
  }

  /**
   * Implement optimistic updates for basic actions.
   */

  handleButtonPress(action) {
    switch (action) {
      case ITunesActions.PLAY_PAUSE:
        this.playerState.isPlaying = !this.playerState.isPlaying;
        break;
      default:
        return false;
    }
  }

  handleRate(rating) {
    let track = this.playerState.currentTrack;
    if (track) {
      track.rating = rating;
      return true;
    }
    return false;
  }

  handleSetPosition(position) {
    let track = this.playerState.currentTrack;
    if (track) {
      track.currentPosition = position;
      return true;
    }
    return false;
  }

  handleSetVolume(volume) {
    this.playerState.volume = volume;
    return false;
  }
}

module.exports = alt.createStore(PlayerStore, 'PlayerStore');
