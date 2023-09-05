// orignially copied from https://casesandberg.github.io/react-color/#examples
import React from 'react';
import reactCSS from 'reactcss';
import PropTypes from 'prop-types';
import { SketchPicker } from 'react-color';

function isHex(color) {
  const hexRegex = '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$';
  return color.match(hexRegex);
}

function rgbToHex(color) {
  return `#${((1 << 24) + (color.r << 16) + (color.g << 8) + color.b).toString(16).slice(1)}`; // eslint-disable-line no-bitwise
}

function hexToRgb(hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const hexFunc = hex.replace(shorthandRegex, (m, r, g, b) => (r + r + g + g + b + b));

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexFunc);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
    a: 100
  } : null;
}

class ColorPicker extends React.Component {
  constructor() {
    super();

    this.state = {
      displayColorPicker: false,
      color: {
        r: '221',
        g: '221',
        b: '221',
        a: '100'
      }
    };

    this.setColor = this.setColor.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  setColor(color) {
    if (color && isHex(color) != null) {
      this.setState({ color: hexToRgb(color) });
    }
  }

  handleClose() {
    this.setState({ displayColorPicker: false });
  }

  handleChange(color) {
    const { rgb } = color;
    this.setState({ color: rgb });
    const { changeThumbnail } = this.props;
    changeThumbnail(rgbToHex(rgb));
  }

  handleClick() {
    const { displayColorPicker } = this.state;
    this.setState({ displayColorPicker: !displayColorPicker });
  }

  render() {
    const { color } = this.state;
    const { r } = color;
    const { g } = color;
    const { b } = color;
    const { a } = color;
    const styles = reactCSS({
      default: {
        color: {
          background: `rgba(${r}, ${g}, ${b}, ${a})`
        }
      }
    });
    const { displayColorPicker } = this.state;

    return (
      <div className="color-picker">
        <div className="swatch" role="button" onClick={this.handleClick} onKeyDown={this.handleClick} tabIndex={0}>
          <div className="color" style={styles.color} />
        </div>
        { displayColorPicker ? (
          <div className="popover">
            <div className="cover" role="button" onClick={this.handleClose} onKeyDown={this.handleClick} tabIndex={0} />
            <SketchPicker color={color} onChange={this.handleChange} />
          </div>
        ) : null}
      </div>
    );
  }
}

ColorPicker.propTypes = {
  changeThumbnail: PropTypes.func
};

ColorPicker.defaultProps = {
  changeThumbnail: null
};

export default ColorPicker;
