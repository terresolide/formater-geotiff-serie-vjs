/**
 * A control layer to display interactive colorscale caption
 * @author epointal
 * @module L.Control.ColorscaleControl
 * @requires plotty
 * @requires leaflet
 */
var plotty = require('plotty')

if (typeof L === 'undefined'){
  var L = require('leaflet')
}
L.Control.ColorscaleControl = L.Control.extend({
    options: {
        position: 'bottomright',
    },
    _colorscale: 'jet',
    _displayMin: 0,
    _displayMax: 1,
    _canvas: null,
    _tooltip: null,
    initialize: function (portrayal, options) {
      if (portrayal) {
        this.setPortrayal(portrayal)
      }
      if (!options){
        options = {}
      }
      L.Util.setOptions(this, options);
      L.Control.prototype.initialize.call(options);
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
      return this._initLayout()
    },
    onRemove: function () {
      L.DomEvent.off(this._canvas, 'mouseover', this._displayTooltip, this)
      L.DomEvent.off(this._canvas, 'mousemove', this._displayTooltip, this)
      this._canvas.remove()
      this._canvas = null
    },
    _initLayout: function () {
      var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-colorscale');
      
      //add tooltip
      this._tooltip = L.DomUtil.create('div', 'leaflet-colorscale-tooltip hidden')
      container.append(this._tooltip)
      
      //add canvas
      this._canvas = L.DomUtil.create('canvas')
      L.DomEvent.on(this._canvas, 'mouseover', this._displayTooltip, this)
      L.DomEvent.on(this._canvas, 'mousemove', this._displayTooltip, this)
      L.DomEvent.on(this._canvas, 'mouseout', this._hideTooltip, this)
      this._canvas.width = 256
      this._canvas.height = 1
      plotty.renderColorScaleToCanvas(this._colorscale, this._canvas)
      container.append(this._canvas)
 
      //stop event propagation on container
      L.DomEvent.disableClickPropagation(container);
      L.DomEvent.on(container, 'wheel', L.DomEvent.stopPropagation);
      return container
    },
    _displayTooltip: function (evt) {
      this._tooltip.innerHTML = 'machin'
      this._tooltip.style.opacity = 0.9
      var pos = this._canvas.getBoundingClientRect()
      var posX = evt.clientX - pos.left
      this._tooltip.style.left = (posX - 20) + "px"
      var value = posX * (this._displayMax - this._displayMin) / pos.width + this._displayMin
      
      //@todo affichage petit et grand nombre!! avec 3 chiffres de précision max
      this._tooltip.innerHTML = (Math.round(value * 1000) / 1000)
    },
    _hideTooltip: function (evt) {
      this._tooltip.style.opacity = 0
    }
})

module.exports = L.Control.ColorscaleControl;
