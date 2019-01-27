// orignially copied from https://casesandberg.github.io/react-color/#examples
import React from 'react'
import reactCSS from 'reactcss'
import { SketchPicker } from 'react-color'

function isHex(color) {
  const hexRegex = '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$';
  return color.match(hexRegex);
}

function rgbToHex(color) {
    return "#" + ((1 << 24) + (color.r << 16) + (color.g << 8) + color.b).toString(16).slice(1);
}

function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        a: 100
    } : null;
}

class ColorPicker extends React.Component {
  state = {
    displayColorPicker: false,
    color: {
      r: '221',
      g: '221',
      b: '221',
      a: '100',
    },
  };

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false })
  };

  handleChange = (color) => {
    this.setState({ color: color.rgb });
    this.props.changeThumbnail(rgbToHex(color.rgb));
  };

  setColor(color) {
    if (isHex(color) != null) {
      this.setState({ color: hexToRgb(color)});
    }
  }

  render() {

    const styles = reactCSS({
      'default': {
        color: {
          background: `rgba(${ this.state.color.r }, ${ this.state.color.g }, ${ this.state.color.b }, ${ this.state.color.a })`,
        }
      },
    });

    return (
      <div className='color-picker'>
        <div className='swatch' onClick={ this.handleClick }>
          <div className='color' style={ styles.color } />
        </div>
        { this.state.displayColorPicker ? <div className='popover'>
          <div className='cover' onClick={ this.handleClose }/>
          <SketchPicker color={ this.state.color } onChange={ this.handleChange } />
        </div> : null }

      </div>
    )
  }
}

export default ColorPicker