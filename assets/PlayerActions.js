const alt = require('./alt');
const rest = require('./rest');

let _currentUpdate = null;
let _updateTime = 0;
let _lastOptimisticUpdate = 0;
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
    _updateTime = Date.now();
    _currentUpdate = rest('/status');
    return _currentUpdate.then((resp) => {
      if (_updateTime > _lastOptimisticUpdate) {
        this.dispatch(resp.entity);
      }
      _currentUpdate = null;
    });
  }

  pressButton(button) {
    rest({method: 'POST', path: '/action/' + button});
    _cancelUpdate();
    this.dispatch(button);
    _lastOptimisticUpdate = Date.now();
  }

  rateCurrentSong(rating) {
    rest({
      method: 'POST',
      path: '/rate',
      params: {rating},
    });
    _cancelUpdate();
    this.dispatch(rating);
    _lastOptimisticUpdate = Date.now();
  }

  setPosition(position) {
    rest({
      method: 'POST',
      path: '/position',
      params: {position},
    });
    _cancelUpdate();
    this.dispatch(position);
    _lastOptimisticUpdate = Date.now();
  }

  setVolume(volume) {
    rest({
      method: 'POST',
      path: '/volume',
      params: {volume},
    });
    _cancelUpdate();
    this.dispatch(volume);
    _lastOptimisticUpdate = Date.now();
  }

  updateState(state) {
    this.dispatch(state);
  }
}

module.exports = alt.createActions(PlayerActions);
