/**
 *  Geotiff serie layer is an interactive ImageOverlay to display imageOverlay serie having the same bounds
 *  @parameter {L.LatLngBoundsbounds} bbox of the image
 *  @parameter {Boolean} api true if exist an api to request with latlng localisation when click
 *  @listen    selectImageSerieEvent => change url image
 *  @listen    toggleImageSerieEvent => show/hide overlay
 *  @listen    resetGeotiffViewEvent => map fit bounds overlay
 *  @listen    modeChangeEvent (mode pass from video to profile)
 *  @trigger   searchProfileEvent 
 *  @trigger   nextImageEvent
 *  @requires  leaflet
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
  modeChangeListener: null,
  mode: 'video',
  hasApi: null,
  initialize (bounds, api, options) {
    var url = 'https://api.poleterresolide.fr/images/transparent.png'
    if (!options){
        options = {}
    }
    this.hasApi = api
    L.Util.setOptions(this, options);
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
    this.click = 0
    this.on( 'click', function(evt){
      this.click = this.click + 1
      var _this = this
      // to prevent dblclick particulary for searchProfile request
      setTimeout(function () {_this.click = 0}, 500)
      if(this.click !== 1){
        return
      }
      switch(this.mode){
      case 'video':
        var event = new CustomEvent('nextImageEvent')
        document.dispatchEvent(event)
        break
      case 'profile':
        if (!_this.hasApi) {
          return;
        }
        var event = new CustomEvent('searchProfileEvent', {detail: evt.latlng})
        document.dispatchEvent(event)
        break
      } 
    });
    
    this.on( 'dblclick', function( evt){
      this.removeEventParent(evt);
    })
    L.DomEvent.on(document, 'selectImageSerieEvent', this._selectImage, this)
    L.DomEvent.on(document, 'toggleImageSerieEvent', this._showImage, this)
    L.DomEvent.on(document, 'resetGeotiffViewEvent', this._resetView, this)
    L.DomEvent.on(document, 'modeChangeEvent', this._modeChange, this)
  },
  removeListeners () {
    L.DomEvent.off(document, 'selectImageSerieEvent', this._selectImage, this)
    L.DomEvent.off(document, 'toggleImageSerieEvent', this._showImage, this)
    L.DomEvent.off(document, 'resetGeotiffViewEvent', this._resetView, this)
    L.DomEvent.off(document, 'modeChangeEvent', this._modeChange, this)
  },
  _modeChange (evt) {
    this.mode = evt.detail
  },
  _resetView: function (evt) {
    this._map.fitBounds(this._bounds)
  },
  _selectImage: function(evt) {
    this.setUrl(evt.detail.img);
    var node = this.getElement();
    node.setAttribute( 'title', evt.detail.datestr);
    node.setAttribute( 'alt', evt.detail.datestr);
  },
  _showImage: function(evt) {
    var opacity = evt.detail.show ? 0.6: 0;
    this.setOpacity( opacity);
  }
})

module.exports = L.GeotiffSerieLayer;