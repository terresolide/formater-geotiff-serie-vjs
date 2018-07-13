/**
 *  Geotiff serie layer is an interactive ImageOverlay
 *  listen to : selectedImage Event => change url image
 *  listen to : toggleImage Event (actual showImage ) => show/hide overlay
 *  trigger : nextImageEvent when receive click
 *  link to geotiff-serie-control (actual geotiff-visualizer)
 */

L.GeotiffSerieLayer = L.ImageOverlay.extend({
  options: {
    crossOrigin:true,
    zIndex:2000, 
    opacity:0.6, 
    interactive:true, 
    bubblingMouseEvents:false,
  },
  resetGeotiffViewListener: null,
  initialize (bounds, options) {
    var url = 'https://api.poleterresolide.fr/images/transparent.png'
    L.ImageOverlay.prototype.initialize.call(this, url, bounds, options);
  },
  onAdd (map) {
    L.ImageOverlay.prototype.onAdd.call(this, map);
    this.initHandler()
  },
  onRemove () {
    this.removeListeners()
    L.ImageOverlay.prototype.onRemove.call(this);
  },
  initHandler () {
    this.on( 'click', function( evt){
      var event = new CustomEvent( 'nextImageEvent');
      document.dispatchEvent( event);
    });
    this.on( 'dblclick', function( evt){
      this.removeEventParent(evt);
    });
    L.DomEvent.on(document, 'selectImageSerieEvent', this._selectImage, this)
    L.DomEvent.on(document, 'toggleImageSerieEvent', this._showImage, this)
    L.DomEvent.on(document, 'resetGeotiffViewEvent', this._resetView, this)
  },
  removeListeners () {
    L.DomEvent.off(document, 'selectImageSerieEvent', this._selectImage, this)
    L.DomEvent.off(document, 'toggleImageSerieEvent', this._showImage, this)
    L.DomEvent.off(document, 'resetGeotiffViewEvent', this._resetView, this)
  },
  _resetView: function (evt) {
    this._map.fitBounds(this._bounds)
  },
  _selectImage: function(evt) {
    this.setUrl(evt.detail.img);
    var node = this.getElement();
    node.setAttribute( 'title', evt.detail.date);
    node.setAttribute( 'alt', evt.detail.date);
  },
  _showImage: function(evt) {
    var opacity = evt.detail.show ? 0.6: 0;
    this.setOpacity( opacity);
  }
})

module.exports = L.GeotiffSerieLayer;