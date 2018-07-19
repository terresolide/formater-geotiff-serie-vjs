/**
 * @author epointal
 * @module SelectedMarker use to synchronize markers
 * 
 */
L.SelectedMarker =   L.Evented.extend({
	marker:null,
	map: null,
	initialize: function(options){
		L.Util.setOptions(this, options);
	  L.DomEvent.on(document, 'closeBlockEvent', this.unselect, this)
	},
	change:function(marker){
		if (this.marker) {
		  // close block then unselect the selected marker
		  var evt = new CustomEvent('closeBlockEvent',{
		    detail: {
		      blockId: 'graph',
		      layerId: this.marker._leaflet_id
		    }
		  })
		  document.dispatchEvent(evt)
		}
		if (marker != this.marker){
		  marker.select()
		  this.marker = marker
		}else{
		  this.marker = null
		}
	},
	unselect: function (evt) {
	  if (this.marker){
	    this.marker.unselect()
	  }
	}
})
module.exports = L.SelectedMarker;