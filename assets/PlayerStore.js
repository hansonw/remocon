const alt = require('./alt');
const PlayerActions = require('./PlayerActions');

class PlayerStore {
  constructor() {
    this.playerState = {};
    this.bindListeners({
      handleUpdatePlayers: [PlayerActions.UPDATE_STATE, PlayerActions.LOAD_STATE],
    });
  }

  handleUpdatePlayers(state) {
    this.playerState = state;
  }
}

module.exports = alt.createStore(PlayerStore, 'PlayerStore');
