/**
 * A control layer to choose the map mode
 * @author epointal
 * @module L.Control.ModeControl
 * @requires leaflet
 */
L.Control.ModeControl = L.Control.extend({
  options: {
    collapsed: true,
    position: 'topleft',
    autoZIndex: true
  },
  aerisThemeListener: null,
  _mode: [
    {
      value: 'video',
      checked: true,
      label: {
        fr: 'Lecture',
        en: 'Playback'
      }
    },
    {
      value: 'profile',
      label: {
        fr: 'Profil temporel',
        en: 'Temporal profile'
      }
    }],
  _lang: 'fr',
  _form: null,
  _color: '#000',
  initialize: function(lang, mode, options){
    if (mode) {
      this._mode = mode
    }
    if (lang) {
      this._lang = lang
    }
    if (!options){
      options = {}
    }
    this.aerisThemeListener = this.handleTheme.bind(this) 
    document.addEventListener('aerisTheme', this.aerisThemeListener);
    
    var event = new CustomEvent('aerisThemeRequest', {});
    document.dispatchEvent(event);
    
    L.Control.prototype.initialize.call(options);
  },
  onAdd : function(map){
    return this._initLayout()
  },
  handleTheme: function(evt){
    this._color = evt.detail.primary;
  },
  setColor( color){
    this._container.querySelector('h4').style.background = color;
    this._container.querySelector('h4 a').style.background = color;
  },
  _initLayout: function () {
    var className = 'leaflet-bar leaflet-control leaflet-mode'
    var container = L.DomUtil.create('div', className)
    this._form = this._initForm(className)
    
    //init mode 
    this._modeChange()
    
    //create collapse button
    if (this.options.collapsed) {
      var h4 = L.DomUtil.create('h4', '', container)
      var link = L.DomUtil.create('a', className + '-toggle fa fa-toggle-on', h4);
      link.href = '#';
      link.title = 'Modes'
      var span = L.DomUtil.create('span','', h4)
      span.innerHTML = 'Modes'
        L.DomEvent
            //.on(link, 'click', L.DomEvent.stop)
            .on(link, 'click', this._toggle, this);
      container.append(h4)
    } 
    container.append(this._form)
    L.DomEvent.disableClickPropagation(container)
    L.DomEvent.on(container, 'wheel', L.DomEvent.stopPropagation)
    this._container = container
    return container
  },
  _addItem: function (obj) {
    var div = L.DomUtil.create('div', 'leaflet-item')
    var input = L.DomUtil.create('input')
    input.type = 'radio'
    input.name ="formater-mode"
    input.checked = obj.checked
    input.id = 'ft-mode-' + obj.value
    input.value = obj.value
    div.append(input)
    var label = L.DomUtil.create('label')
    label.for = 'ft-mode-' + obj.value
    label.innerHTML = obj.label[this._lang]
    div.append(label)
    L.DomEvent.on(input, 'change', this._modeChange, this)
    this._form.append(div)
  },
  _initForm: function (className) {
    if (this._mode.length === 0){
      return null
    }
    this._form = L.DomUtil.create('form', className + '-list');
    for(var i=0; i < this._mode.length; i++){
      this._addItem(this._mode[i])
    }
    return this._form
  },
  _collapse: function () {
    this.setColor('#fff')
    this._container.className = this._container.className.replace(' leaflet-control-expanded', '');
  },
  _expand: function () {
    L.DomUtil.addClass(this._container, 'leaflet-control-expanded')
    if( this._color){
      this.setColor( this._color);
    }
  },
  _toggle: function () {
    if( this._container.className.indexOf('leaflet-control-expanded')>=0){
      this._collapse();
    }else{
      this._expand();
    }
  },
  _modeChange: function (evt){
    var value = this._form.querySelector('input[name="formater-mode"]:checked').value
    var event = new CustomEvent('modeChangeEvent', { detail: value});
    document.dispatchEvent(event);
  }
})

module.exports = L.Control.ModeControl;
