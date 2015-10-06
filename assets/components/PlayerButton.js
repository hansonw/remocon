const React = require('react');
const {PropTypes} = React;

class PlayerButton extends React.Component {
  render() {
    return (
      <a href="#" onClick={this.props.onClick}>
        <div className="button">
          <i className={'fa fa-lg ' + this.props.glyph} />
        </div>
      </a>
    );
  }
}

PlayerButton.propTypes = {
  glyph: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

module.exports = PlayerButton;
