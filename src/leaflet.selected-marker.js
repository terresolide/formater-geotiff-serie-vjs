/**
 * 
 */
L.SelectedMarker =   L.Evented.extend({
	marker:null,
	map: null,
	initialize: function(options){
	  
		L.Util.setOptions(this, options);
	},
	change:function(marker){
		if (this.marker) {
		  this.marker.unselect()
		}
		if (marker != this.marker){
		  marker.select()
		  this.marker = marker
		}else{
		  this.marker = null
		}
	}
})
module.exports = L.SelectedMarker;