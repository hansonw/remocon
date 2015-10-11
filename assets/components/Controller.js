'use strict';

const Button = require('./PlayerButton');
const Fastclick = require('fastclick');
const {ITunesActions} = require('../../lib/constants');
const ArtworkStore = require('../ArtworkStore');
const PlayerActions = require('../PlayerActions');
const PlayerStore = require('../PlayerStore');
const React = require('react');
import Slider from './slider';

function renderTimestamp(_seconds) {
  let seconds = Math.round(_seconds);
  let min = Math.floor(seconds / 60);
  let sec = seconds % 60;
  if (sec < 10) {
    sec = '0' + sec;
  }
  return (
    <span className="timestamp">
      {min}:{sec}
    </span>
  );
}

class Controller extends React.Component {
  constructor() {
    super();
    this.state = {
      ...PlayerStore.getState(),
      ...ArtworkStore.getState(),
    };
    this.onChange = this.onChange.bind(this);
    this._onVolumeChange = this._onVolumeChange.bind(this);
  }

  componentDidMount() {
    Fastclick.attach(React.findDOMNode(this));

    PlayerStore.listen(this.onChange);
    ArtworkStore.listen(this.onChange);
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
    let {currentTrack, isPlaying, volume} = this.state.playerState;
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
            key={i}
            onClick={() => this._rateSong(i * 20)}
          >
            <i className={'fa ' + starClass} />
          </span>
        );
      }

      let artStyle = {
        backgroundImage: 'url(/placeholder_art.png)',
      };
      if (currentTrack.hasArtwork) {
        let artwork = this.state.trackArtwork[currentTrack.id];
        if (artwork) {
          let {format, data} = artwork;
          artStyle.backgroundImage = 'url(data:' + format + ';base64,' + data + ')';
        }
      }

      trackInfo =
        <div className="track-info">
          <div className="track-art" onClick={this._refreshMaybe} style={artStyle} />
          <div className="track-name">
            {currentTrack.name}
          </div>
          <div className="artist-name">
            {currentTrack.artist || 'Unknown Artist'}
            {currentTrack.album ? ' - ' + currentTrack.album : null}
          </div>
          <div className="track-progress">
            {renderTimestamp(currentTrack.currentTime)}
            <Slider
              max={currentTrack.duration}
              onChange={this._onProgressChange}
              value={currentTrack.currentTime}
              width="70%"
            />
            {renderTimestamp(currentTrack.duration)}
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
        <div className="volume">
          <i className="fa fa-volume-down" />
          <Slider
            max={100}
            onChange={this._onVolumeChange}
            value={volume}
            width="60%"
          />
          <i className="fa fa-volume-up" />
        </div>
      </div>
    );
  }

  _refreshMaybe() {
    // For testing on iOS standalone mode.
    if (window.navigator.standalone) {
      window.location.reload();
    }
  }

  _onClick(action) {
    PlayerActions.pressButton(action);
  }

  _onProgressChange(progress) {
    PlayerActions.setPosition(progress);
  }

  _onVolumeChange(vol) {
    PlayerActions.setVolume(vol);
  }

  _rateSong(rating) {
    PlayerActions.rateCurrentSong(rating);
  }
}

module.exports = Controller;
