'use strict';

const Button = require('./PlayerButton');
const Fastclick = require('fastclick');
const {ITunesActions} = require('../../lib/constants');
const PlayerActions = require('../PlayerActions');
const PlayerStore = require('../PlayerStore');
const React = require('react');

function toMMSS(seconds) {
  let min = Math.floor(seconds / 60);
  let sec = seconds % 60;
  if (sec < 10) {
    sec = '0' + sec;
  }
  return min + ':' + sec;
}

class Controller extends React.Component {
  constructor() {
    super();
    this.state = PlayerStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    Fastclick.attach(React.findDOMNode(this));

    PlayerStore.listen(this.onChange);
    this._refresh = setInterval(
      PlayerActions.loadState,
      500,
    );
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
    let {currentTrack, isPlaying} = this.state.playerState;
    if (currentTrack) {
      let rating = [];
      for (let i = 1; i <= 5; i++) {
        let starClass = 'fa-star-o';
        if (currentTrack.rating >= i * 20) {
          starClass = 'fa-star';
        } else if (currentTrack.rating >= i * 20 - 10) {
          starClass = 'fa-star-half-empty';
        }
        rating.push(
          <span
            className="rating-star"
            onClick={() => this._rateSong(i * 20)}>
            <i className={'fa ' + starClass} />
          </span>
        );
      }

      trackInfo =
        <div className="track-info">
          <div className="track-name">
            {currentTrack.name}
          </div>
          <div className="artist-name">
            {currentTrack.artist}
          </div>
          <div className="album-name">
            {currentTrack.album}
          </div>
          <div className="track-progress">
            {toMMSS(currentTrack.currentTime)}
            {' / '}
            {toMMSS(currentTrack.duration)}
          </div>
          <div className="track-rating">
            {rating}
          </div>
        </div>;
    }

    return (
      <div className="controller">
        {trackInfo}
        <div>
          <Button
            glyph="fa-fast-backward"
            onClick={() => this._onClick(ITunesActions.BACK_TRACK)}
          />
          <Button
            glyph={!isPlaying ? 'fa-play' : 'fa-pause'}
            onClick={() => this._onClick(ITunesActions.PLAY_PAUSE)}
          />
          <Button
            glyph="fa-fast-forward"
            onClick={() => this._onClick(ITunesActions.NEXT_TRACK)}
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

  _rateSong(rating) {
    PlayerActions.rateCurrentSong(rating);
  }
}

module.exports = Controller;
