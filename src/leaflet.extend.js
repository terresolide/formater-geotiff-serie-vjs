/**
 * 
 */
var L = require("leaflet")

L.GeotiffSerieLayer = require("./leaflet.geotiff-serie-layer.js")
L.Control.ResetControl = require("./leaflet.reset-control.js")
L.Control.ColorscaleControl = require("./leaflet.colorscale-control.js")
L.Control.ModeControl = require('./leaflet.mode-control.js')
L.GraphMarker = require('./leaflet.graph-marker.js')
L.SelectedMarker = require('./leaflet.selected-marker.js')

module.exports = L