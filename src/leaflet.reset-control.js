/**
 * 
 */
/* global L */

// A layer control which provides for layer groupings.
// Author: Ishmael Smyrnow
L.Control.ResetControl = L.Control.extend({
    options: {
        position: 'topleft',
    },
    _center: null,
    _zoom: 13,
    initialize: function (bounds, options) {
      this._bounds = bounds
      console.log('use L util')
      console.log('after L util')
    },
    setBounds: function (bounds) {
      this._bounds = bounds
    },
    onAdd : function(map){
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-reset');
        var a = L.DomUtil.create('a','fa fa-undo')
        container.append(a)
        var bounds = this._bounds;
        a.onclick = function(){
            map.fitBounds(bounds);
        }
        return container
    }
})

module.exports = L.Control.ResetControl;
