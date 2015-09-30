const Fastclick = require('fastclick');
const React = require('react');
const {PropTypes} = React;

class PlayerButton extends React.Component {
  componentDidMount() {
    Fastclick.attach(React.findDOMNode(this));
  }

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

PlayerButton.propTypes = {
  glyph: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

module.exports = PlayerButton;
