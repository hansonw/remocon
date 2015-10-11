const React = require('react');
const {PropTypes} = React;

class Slider extends React.Component {
  constructor(props) {
    super();
    this.state = {value: props.value};
  }

  componentDidMount() {
    this._clientRect = this.refs.slider.getDOMNode().getBoundingClientRect();
  }

  componentWillReceiveProps(props) {
    if (!this._sliding) {
      this.setState({value: props.value});
    }
  }

  render() {
    let percent = this.state.value / this.props.max * 100;
    let width = percent.toString() + '%';
    return (
      <div
        className="slider-container"
        onMouseDown={this._onTouchDown.bind(this)}
        onTouchStart={this._onTouchDown.bind(this)}
        ref="slider"
        style={{width: this.props.width}}
      >
        <div className="slider">
          <div className="slider-fill" style={{width}} />
        </div>
      </div>
    );
  }

  _updateValue(event) {
    let touch = event.changedTouches[0];
    let {left, right} = this._clientRect;
    let value = (touch.clientX - left) / (right - left);
    if (value < 0) {
      value = 0;
    } else if (value > 1) {
      value = 1;
    }
    value = Math.round(value * this.props.max);
    this.setState({value});
    return value;
  }

  _onTouchDown(event) {
    this._updateValue(event);
    let moveHandler = (evt) => {
      this._updateValue(evt);
    };
    this._sliding = true;
    let endHandler = (evt) => {
      let pct = this._updateValue(evt);
      this.props.onChange(pct);
      this._sliding = false;
      document.removeEventListener('touchmove', moveHandler);
      document.removeEventListener('touchend', endHandler);
    };
    document.addEventListener('touchmove', moveHandler);
    document.addEventListener('touchend', endHandler);
  }
}

Slider.propTypes = {
  max: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.number,
  width: PropTypes.string,
};

module.exports = Slider;
