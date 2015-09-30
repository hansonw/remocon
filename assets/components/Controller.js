'use strict';

const PlayerActions = require('../PlayerActions');
const PlayerStore = require('../PlayerStore');
const Button = require('./PlayerButton');
const React = require('react');

class Controller extends React.Component {
  constructor() {
    super();
    this.state = PlayerStore.getState();

    this.onChange = this.onChange.bind(this);
    this._refresh = setInterval(
      PlayerActions.loadState,
      500,
    );
  }

  componentDidMount() {
    PlayerStore.listen(this.onChange);
  }

  componentWillUnmount() {
    PlayerStore.unlisten(this.onChange);
    clearInterval(this._refresh);
  }

  onChange(state) {
    this.setState(state);
  }

  render() {
    let trackInfo;
    let track = this.state.playerState.currentTrack;
    if (track) {
      trackInfo =
        <div className="track-info">
          <div className="track-name">
            {track.name}
          </div>
          <div className="artist-name">
            {track.artist}
          </div>
          <div className="album-name">
            {track.album}
          </div>
        </div>;
    }

    return (
      <div className="controller">
        {trackInfo}
        <div>
          <Button
            glyph="fa-fast-backward"
            onClick={() => this._onClick('prevtrack')}
          />
          <Button
            glyph="fa-play"
            onClick={() => this._onClick('playpause')}
          />
          <Button
            glyph="fa-fast-forward"
            onClick={() => this._onClick('nexttrack')}
          />
        </div>
        <div>
          <Button
            glyph="fa-volume-off"
            onClick={() => this._onClick('volumemute')}
          />
          <Button
            glyph="fa-volume-down"
            onClick={() => this._onClick('volumedown')}
          />
          <Button
            glyph="fa-volume-up"
            onClick={() => this._onClick('volumeup')}
          />
        </div>
      </div>
    );
  }

  _onClick(action) {
    PlayerActions.pressButton(action);
  }
}

module.exports = Controller;
