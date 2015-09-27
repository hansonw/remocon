'use strict';

const rest = require('rest');
const React = require('react');
const {PropTypes} = React;

class Button extends React.Component {
  render() {
    return (
      <a href="#" onClick={this.props.onClick}>
        <div className="button">
          <i className={'fa fa-2x ' + this.props.glyph} />
        </div>
      </a>
    );
  }
}

Button.propTypes = {
  glyph: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

class Controller extends React.Component {
  render() {
    return (
      <div className="controller">
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
    rest({method: 'POST', path: '/' + action});
  }
}

module.exports = Controller;
