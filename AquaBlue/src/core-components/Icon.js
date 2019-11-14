/**
 * Wrapper component for svg images, places the svg inline
 *
 * @param {string} name - the svg file name
 * @param {string} width - the svg width
 * @param {string} height - the svg height
 * @param {string} [viewBox] - the svg viewBox
 * @param {string} [className] - a class name to place on svg element
 */

import React, { Component } from 'react';
import SVG from 'react-inlinesvg';

class Icon extends Component {

  setSvgDimentions() {
    const { className, viewBox, height, width } = this.props

    const svgImage = document.querySelector(`.${className} svg`)
    if (svgImage) {
      viewBox && svgImage.setAttribute('viewBox', viewBox)
      height && svgImage.setAttribute('height', height)
      width && svgImage.setAttribute('width', width)
    }
  }

  setCssClass() {
    const { className } = this.props

    //adding className to all <g> nodes under svg to allow stroke coloring
    if (document.querySelectorAll(`.${className} > svg`).length) {
      Array.prototype.slice.call(document.querySelectorAll(`.${className} > svg`)[0].querySelectorAll('g')).forEach((element) =>
        element.classList.add(className)
      )
    }
  }

  onLoad() {
    this.setSvgDimentions()
    this.setCssClass()
  }

  render() {

    const { name, className, height, width} = this.props

    if(!name || !height || !width) {
      return null
    }

    const splittedName = name.split('.')

    if (splittedName.length <= 1) {
      return null
    }

    const src = require(`$assets/images/${name}`)
    const extension = splittedName[1]

    if (extension === 'svg') {
      return (
        <div className="icon icon-holder" style={{width: `${width}`, height: `${height}`, 'backgroundSize': `${width} ${height}`}}>
          <SVG
            src={src}
            onLoad={this.onLoad.bind(this)}
            uniqueHash={name}
            className={`icon-image ${className}`}
            width={`${width}`}
            height={`${height}`}
          />
        </div>
      );
    }
  }
}

export default Icon
