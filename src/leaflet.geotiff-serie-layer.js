/**
 * 
 */

L.geotiffSerieHandler = L.Handler.extend({
    addHooks: function() {
        L.DomEvent.on(document, 'selectedImage', this._selectImage, this)
        L.DomEvent.on(document, 'showImage', this._showImage, this)
    },

    removeHooks: function() {
        L.DomEvent.off(document, 'selectedImage', this._selectImage, this)
        L.DomEvent.off(document, 'showImage', this._showImage, this)
    },

    _selectImage: function(evt) {
      console.log('dans Handler')
      this.setUrl( evt.detail.img);
    },
    _showImage: function(evt) {
      
    }
});
L.GeotiffSerieLayer = L.ImageOverlay.extend({
  options: {
    crossOrigin:true,
    zIndex:2000, 
    opacity:0.6, 
    interactive:true, 
    bubblingMouseEvents:false,
  },
  initialize (url, bounds, options){
    L.ImageOverlay.prototype.initialize.call(this, url, bounds, options)
  },
  onAdd (map) {
    L.ImageOverlay.prototype.onAdd.call(this, map);
    console.log("add")
    console.log(this.options)
    this.on( "click", function( evt){
      var event = new CustomEvent( "nextImageEvent");
      document.dispatchEvent( event);
    });
    this.on( "dblclick", function( evt){
      this.removeEventParent(evt);
    });
    this.initHandler()
    
  },
  onRemove () {
    this.removeListeners()
    L.ImageOverlay.prototype.onRemove.call(this);
  },
  initHandler () {
    L.DomEvent.on(document, 'selectedImage', this._selectImage, this)
    L.DomEvent.on(document, 'showImage', this._showImage, this)
  },
  removeListeners () {
    L.DomEvent.off(document, 'selectedImage', this._selectImage, this)
    L.DomEvent.off(document, 'showImage', this._showImage, this)
  },
  _selectImage: function(evt) {
    console.log(evt.detail.img)
    this.setUrl(evt.detail.img);
  },
  _showImage: function(evt) {
    var opacity = evt.detail.show ? 0.6: 0;
    this.setOpacity( opacity);
  }
})

L.GeotiffSerieLayer.addInitHook(function(){
  // appeler juste après initialize
})
L.geotiffSeriesLayer = function (url, bounds, options) {
  return new L.GeotiffSerieLayer(url, bounds, options)
}
module.exports = L.GeotiffSerieLayer;