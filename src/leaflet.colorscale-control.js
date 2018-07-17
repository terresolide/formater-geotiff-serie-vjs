/**
 * 
 */
/* global L */

// A layer control which provides for layer groupings.
// Author: Ishmael Smyrnow
var plotty = require('plotty')

L.Control.ColorscaleControl = L.Control.extend({
    options: {
        position: 'bottomright',
    },
    _colorscale: 'rainbow',
    _displayMin: 0,
    _displayMax: 1,
    _canvas: null,
    initialize: function (portrayal) {
      this.setPortrayal(portrayal)
    },
    setPortrayal: function (portrayal) {
      this._colorscale = portrayal.colorscale
      this._displayMin = portrayal.displayMin
      this._displayMax = portrayal.displayMax
    },
    setColorscale: function (colorscale) {
      this._colorscale = colorscale
      if (this._canvas) {
        plotty.renderColorScaleToCanvas(this._colorScale, this._canvas)
      }
    },
    setMinMax: function (min, max) {
      this._displayMin = min
      this._displayMax = max
    },
    onAdd: function(map){
      var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-colorscale');
      this._canvas = L.DomUtil.create('canvas')
      container.append(this._canvas)
      this._canvas.width = 256
      this._canvas.height = 1
      plotty.renderColorScaleToCanvas(this._colorscale, this._canvas)
      return container
    },
    onRemove: function () {
      this._canvas.remove()
      this._canvas = null
    }
})

module.exports = L.Control.ColorscaleControl;
