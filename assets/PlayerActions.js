const alt = require('./alt');
const rest = require('./rest');

class PlayerActions {
  loadState() {
    rest('/status').then((resp) => {
      this.dispatch(resp.entity);
    });
  }

  pressButton(button) {
    rest({method: 'POST', path: '/' + button});
  }

  updateState(state) {
    this.dispatch(state);
  }
}

module.exports = alt.createActions(PlayerActions);
