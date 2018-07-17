/**
 * A control layer to choose the map mode
 * @author epointal
 * @module L.Control.ModeControl
 * @requires leaflet
 */
L.Control.ModeControl = L.Control.extend({
  options: {
    position: 'topleft',
    autoZIndex: true
  },
  _mode: [],
  initialize: function(mode){
   this._mode = mode
  },
  onAdd : function(map){
   
    return this._initLayout()
  },
  _initLayout: function () {
    var className = 'leaflet-bar leaflet-control leaflet-mode'
    var container = L.DomUtil.create('div', className)
    var form = this._form = L.DomUtil.create('form', className + '-list');
    
    if (this.options.collapsed) {
      var h4 = L.DomUtil.create('h4', '', container)
      var link = L.DomUtil.create('a', className + '-toggle', h4);
      link.href = '#';
      link.title = 'Modes';
    
      var span = L.DomUtil.create('span','', h4);
      span.innerHTML = 'Modes;
        L.DomEvent
            .on(link, 'click', L.DomEvent.stop)
            .on(link, 'click', this._toggle, this);
    } else {
      this._expand()
    }
    L.DomEvent.disableClickPropagation(container)
    L.DomEvent.on(container, 'wheel', L.DomEvent.stopPropagation)
  },
  _collapse: function () {
    this._container.className = this._container.className.replace(' leaflet-control-expanded', '');
  },
  _expand: function () {
    L.DomUtil.addClass(this._container, 'leaflet-control-expanded');
  },
  _toggle: function () {
    if( this._container.className.indexOf('leaflet-control-expanded')>=0){
      this._collapse();
    }else{
      this._expand();
    }
  }
})

module.exports = L.Control.ModeControl;
