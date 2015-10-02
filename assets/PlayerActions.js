const alt = require('./alt');
const rest = require('./rest');

let _currentUpdate = null;
function _cancelUpdate() {
  if (_currentUpdate && _currentUpdate.cancel) {
    _currentUpdate.cancel();
    _currentUpdate = null;
  }
}

class PlayerActions {
  constructor() {
    _currentUpdate = null;
  }

  loadState() {
    _cancelUpdate();
    _currentUpdate = rest('/status');
    _currentUpdate.then((resp) => {
      this.dispatch(resp.entity);
      _currentUpdate = null;
    });
  }

  pressButton(button) {
    rest({method: 'POST', path: '/' + button});
    _cancelUpdate();
    this.dispatch(button);
  }

  rateCurrentSong(rating) {
    rest({
      method: 'POST',
      path: '/rate',
      params: {rating},
    });
    _cancelUpdate();
    this.dispatch(rating);
  }

  updateState(state) {
    this.dispatch(state);
  }
}

module.exports = alt.createActions(PlayerActions);
