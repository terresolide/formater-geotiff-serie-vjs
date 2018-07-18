/**
 * A marker link to a graph with its own icon
 * @author epointal
 * @module L.Control.ModeControl
 * @requires leaflet
 */

L.AwesomeMarkers = require('./leaflet.awesome-markers.js')

L.GraphMarker = L.Marker.extend({
  options: {
    collapsed: true,
    position: 'topleft',
    autoZIndex: true
  },
  data: null,
  initialize: function(latlng,options){
    // init with awesome icon 
    L.Marker.prototype.initialize.call(latlng, options);
  },
  setData (data) {
    this.data = data
  },
  setSelect (){
    
  }
  
})

module.exports = L.GraphMarker;
