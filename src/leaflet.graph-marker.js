/**
 * A marker link to a graph with its own icon
 * and link to the other graph marker with selectedMarker
 * @author epointal
 * @module L.GraphMarker
 * @requires leaflet
 * @requires leaflet.awesome.markers [colorfull and iconic icons] {@link https://github.com/lvoogdt/Leaflet.awesome-markers}
 * @param {L.latlng} latlng - the marker position
 * @param {L.SelectedMarker} selectedMarker - link to the globally selected marker
 * @param {Object} options - options herited from L.Marker without icon and draggable 
 * 
 */

L.AwesomeMarkers = require('./leaflet.awesome-markers.js')

L.GraphMarker = L.Marker.extend({
  data: null,
  selectedMarker: null,
  searching: false,
  initialize: function(latlng, selectedMarker, data, options){
    // init with awesome icon 
   
    if (data) {
      var color = 'green'
    } else {
      var color = options.color || 'cadetblue'
    }
   
    options.icon = new L.AwesomeMarkers.icon( { 
      icon: 'line-chart', 
      prefix: 'fa', 
      markerColor: color
    }); 
    options.draggable = false
    this.selectedMarker = selectedMarker
    L.Util.setOptions(this, options);
    this._latlng = L.latLng(latlng);
    this.data = data
   // L.Marker.prototype.initialize.call(latlng, options)
    this.dispatchData()
  },
  onAdd: function (map) {
    L.Marker.prototype.onAdd.call(this, map)
    // add click listener on marker 
    this.on('click', this.toggle, this)
    this.selectedMarker.change(this)
  },
  onRemove: function (map) {
    this.off('click', this.toggle, this)
    L.Marker.prototype.onRemove.call(this, map)
  },
  setData (data) {
    this.data = data
  },
  toggle () {
    this.selectedMarker.change(this)
  },
  select (){
    var icon = this.options.icon;
    this.options.defColor = icon.options.markerColor
    icon.options.markerColor = "red"
    this.setIcon(icon)
    this.dispatchData(true)
  },
  unselect () {
    var icon = this.options.icon;
    icon.options.markerColor = this.options.defColor
    this.setIcon(icon)
  },
  dispatchData (direct) {
    if (!this.data && !this.searching) {
      this.searchData()
    } else {
      if (this._map) {
      var point = this._map.latLngToContainerPoint(this.getLatLng())
        var event = new CustomEvent('blockContentEvent', {detail: 
          { 
            data: this.data,
            top: point.y, 
            left: point.x, 
            blockId: 'graph', 
            layerId: this._leaflet_id,
            open: direct}})
        document.dispatchEvent(event)
      }
    }
  },
  searchData () {
    
    if (!this.options.api || !this.options.api.url) {
      this.data = {error: 'Aucune api n\'est définie'}
    } else {
      var xhttp = new XMLHttpRequest(); 
      
      xhttp.responseType = "json";
      xhttp.withCredentials = true;
      var _this = this
      this.searching = true
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          if(this.response.error){
            _this.handleError(this.response.error)
          }else{
            _this.handleSuccess(this.response)
          }
          _this.searching = false
        } else {
          _this.searching = true
        }
     }
    //  xhttp.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
     xhttp.open("GET", encodeURI( this.request() ), true);
   //  xhttp.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
     xhttp.send();
    }
  },
  request () {
    var url = this.options.api.url
    var params = [];
    for (var prop in this.options.api) {
      if ( prop != 'url') {
        params.push(prop + '=' + this.options.api[prop])
      }
    }
    var latlng = this.getLatLng()
    params.push('lat=' + latlng.lat)
    params.push('lng=' + latlng.lng)
    return url + '?' + params.join('&');
  },
  handleError (error) {
    console.log(error)
  },
  handleSuccess (response) {
    this.data = response
    
    // change marker color
    this.options.defColor = 'green'
    if (this.selectedMarker.marker !== this){
      var icon = this.options.icon
      icon.options.markerColor = 'green'
      this.setIcon(icon)
    }else{
      this.options.defColor = 'green'
    }
    
    // dispatch data but not come from click on marker
    this.dispatchData(false)
  }
})

module.exports = L.GraphMarker;
