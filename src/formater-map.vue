<!-- 
/**
 * Component build from geotiff-serie metadata 
 * @author epointal
 * 
 */
  -->
 <i18n>
{
   "en":{
       "graphtitle": "Temporal profile",
       "waitprocessend": "Wait for the end of the process to start a new search"
   },
   "fr":{
       "graphtitle":  "Profil temporel",
       "waitprocessend": "Attendre la fin du processus pour lancer une nouvelle recherche"
   }
}
</i18n>

<template>
   <span class="formater-map">  
   
      <!--  <formater-draggable-block ref="graph" id="graph" :title="$t('graphtitle')">-->
      	  <formater-graph id="graph" ref="graph" uom='cm'  :lang="lang" :portrayal="portrayalStr()"  :title="$t('graphtitle')"></formater-graph>
      </formater-draggable-block> 
    <div :id="id"></div>
 
    <div class="geotiff-control">
     <geotiff-serie-control ref="geotiffControl" :images="JSON.stringify(images)" :lang="lang" showatstart="true" fullscreenbutton="true" @fullscreen="handleFullscreen" @resize="resize"></geotiff-serie-control>
    </div>
    </span>
</template>

<script>
/**
 * Component build with the metadata of a geotiff serie 
 *
 * @prop {String} id
 * @prop {String} lang 'en' or 'fr' only
 * @prop {String} metadataurl the url of metadatas for this geotiff serie 
 *                (@exemple https://github.com/terresolide/formater-geotiff-serie-vjs/tree/master/example)
 * @listens document:searchProfileEvent
 * @listens document:modeChangeEvent
 * @fires   document:closeBlockEvent
 * @fires   document:openBlockEvent
 */
var L = require("leaflet")

L.GeotiffSerieLayer = require("./leaflet.geotiff-serie-layer.js")
L.Control.ResetControl = require("./leaflet.reset-control.js")
L.Control.ColorscaleControl = require("./leaflet.colorscale-control.js")
L.Control.ModeControl = require('./leaflet.mode-control.js')
L.GraphMarker = require('./leaflet.graph-marker.js')
L.SelectedMarker = require('./leaflet.selected-marker.js')

export default {
  props:{
      id: {
          type: String,
          default:'map'
      },
      lang: {
          type: String,
          default: 'fr'
      },
      metadataurl: {
          type: String,
          default: 'http://api.formater/geotiff/mexico/info.json'
      }
  },
  data () {
        return {
              map: null,
              images:[],
              bounds: null,
              isFullscreen: false,
              // fullscreen node where append component
              fullscreenNode: null,
              // to register origin node when switch to fullscreen
              parentNode: null,
              selectedMarker: null,
              api: null,
              // define the color legend
              portrayal: {
                colorscale: 'viridis',
                displayMin: -10,
                displayMax: 100
              },
              graphWidth: 350,
              // L.GroupLayers of markers
              graphMarkers: null,
              //listeners
              searchProfileListener: null,
              modeChangeListener:null,
             // pattern: null
        }
  },
  created () {
    // this.$i18n.locale = this.lang
  },
  mounted () {
    this.$i18n.locale = this.lang
    this.initFullscreen()
    this.initMap()
    this.getInfoSerie()
    this.initPortrayal(this.portrayal)
    //this.portrayalStr = JSON.stringify(this.portrayal)
    this.searchProfileListener = this.getProfile.bind(this)
    document.addEventListener('searchProfileEvent', this.searchProfileListener)
    this.modeChangeListener = this.modeChange.bind(this)
    document.addEventListener('modeChangeEvent', this.modeChangeListener)
  },
  destroyed () {
    this.destroyFullscreen()
    document.removeEventListener('searchProfileEvent', this.searchProfileListener)
    this.searchProfileListener = null
    document.removeEventListener('modeChangeEvent', this.modeChangeListener)
    this.modeChangeListener = null
  },
  watch: {
    portrayal (newvalue) {
      //this.portrayalStr = JSON.stringify(newvalue)
      console.log('portrayal change colorscale=' + newvalue.colorscale)
      this.initPortrayal(newvalue)
    }
  },
  computed: {
   
  },
  methods: {
    portrayalStr () {
      console.log('pattern change')
      console.log(JSON.stringify(this.portrayal))
      return JSON.stringify(this.portrayal)
    },
    initPortrayal (newvalue) {
      if (!this.colorscale) {
        this.colorscale = new L.Control.ColorscaleControl(newvalue)
        this.colorscale.addTo(this.map)
      } else {
        this.colorscale.setPortrayal(newvalue)
      }
    },
    initMap () {
      // initialize the map
      var container = this.$el.querySelector("#" + this.id);

      this.map = L.map( container ).setView([19.963193897, -98.467355268], 5);
    
      L.tileLayer('//server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: 'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
          maxZoom: 18,
          minZoom:2
          
        }).addTo( this.map );
      
      this.selectedMarker = new L.SelectedMarker()
      this.graphMarkers = L.layerGroup()
      this.graphMarkers.addTo(this.map)
    
    },
    /**
    * create a fixed div on DOM document where append component when fullscreen
    */
    initFullscreen () {
      var div = document.createElement('div')
      div.className = 'formater-fullscreen'
      this.fullscreenNode = div
      document.body.append(this.fullscreenNode)
      this.parentNode = this.$el.parentNode.parentNode
      this.parentNode.style.height = this.parentNode.offsetHeight + 'px'
    },
    resize () {
      if (!this.$el || !this.$el.parentNode) {
        return
      }
     var parentPos = this.$el.parentNode.parentNode.getBoundingClientRect()
     var geotiffControlPos = this.$el.querySelector('.geotiff-control').getBoundingClientRect()
     this.$el.querySelector('#' + this.id).style.height = (parentPos.height - geotiffControlPos.height) + 'px'
     this.graphWidth = this.$el.parentNode.offsetWidth * 0.5
     this.$refs.graph.querySelector('.formater-draggable-block').style.width = this.graphWidth + 'px'
     if (this.map) {
       this.map.invalidateSize()
     }
     
    },
    destroyFullscreen () {
      this.fullscreenNode.remove()
      this.fullscreenNode = null
    },
    getInfoSerie () {
      // ON VA CHERCHER LES INFORMATIONS DANS LA FICHE DE METADONNEES DE LA SERIE
      // POUR LE MOMENT UN FICHIER INFO DANS LE DOSSIER DES FICHIERS GEOTIFFS
      var _this = this
      this.$http.get( this.metadataurl).then(
                    response => { _this.handleSuccess(response); },
                    response => { _this.handleError(response);}
      );
    },
    handleSuccess (resp){
       this.bounds = L.latLngBounds(
           [resp.body.bbox.north, resp.body.bbox.west], 
           [resp.body.bbox.south, resp.body.bbox.east])
       this.images = resp.body
       // this.portrayalChange(resp.body.portrayal)
       this.portrayal = resp.body.portrayal || this.portrayal
       this.api = resp.body.api || null
       var reset = new L.Control.ResetControl(this.bounds)
       this.map.addControl(reset)
      
     
       this.geotiffSerie = new L.GeotiffSerieLayer(this.bounds, this.api)
       this.geotiffSerie.addTo(this.map)
       
       if (resp.body.example) {
         this.loadExample(resp.body.example)
       }
       if (this.api || resp.body.example) {
	       this.mode = new L.Control.ModeControl(this.lang)
	       this.mode.addTo(this.map)
       }
       
       this.resize()
       //fitBounds after adding geotiffSerie else chrome do not zoom properly
       this.map.fitBounds(this.bounds)
       // this.$refs.geotiffControl.querySelector("#geotiffEye").dispatchEvent(event)
         
    },
//     portrayalChange (portrayal) {
       
//        this.portrayal.colorscale = portrayal.colorscale
//        if (!this.colorscale) {
//          this.colorscale = new L.Control.ColorscaleControl(this.portrayal)
//          this.colorscale.addTo(this.map)
//        } else {
//          this.colorscale.setPortrayal(portrayal)
//        }
//        this.$forceUpdate()
//     },
    handleError (response) {
      console.log(response)
    },
    /**
    * switch fullscreen / normal view
    * @param {Event} evt 
    */
    handleFullscreen (evt) {
      var nodePos = this.$el.querySelector('.geotiff-control').getBoundingClientRect()
      if (this.isFullscreen) {
        this.parentNode.append(this.$el.parentNode)
        var height = this.parentNode.offsetHeight
        this.$el.querySelector('#' +this.id).style.height = (height - nodePos.height) + 'px'
        this.fullscreenNode.style.pointerEvents = 'none'
      }else{
        this.fullscreenNode.append(this.$el.parentNode)
        var height = window.innerHeight || document.documentElement.clientHeight
        this.$el.querySelector('#' +this.id).style.height = (height - nodePos.height) + 'px'
        this.fullscreenNode.style.pointerEvents = 'auto'
      }
      this.isFullscreen = !this.isFullscreen
      this.map.invalidateSize()
    },
    modeChange (evt) {
     
      switch (evt.detail) {
      case 'video':
        this.graphMarkers.remove()
        // close 
        var event = new CustomEvent('closeBlockEvent')
        document.dispatchEvent(event)
        break
      case 'profile':
        this.graphMarkers.addTo(this.map)
        break
      }
    },
    getProfile (evt) {
      if (this.selectedMarker.marker && this.selectedMarker.marker.searching) {
        alert(this.$i18n.t('waitprocessend'))
        return
      }
  
      var marker = new L.GraphMarker(
          evt.detail, 
          this.selectedMarker,
          null,
          {api: this.api})
      this.graphMarkers.addLayer(marker)

      // open formater-draggable-block for graph
      var point = this.map.latLngToContainerPoint(evt.detail)
      var event = new CustomEvent('openBlockEvent',
          {detail: {
            blockId: 'graph',
            top:  point.y, 
            left: point.x,
            closeEnabled: false,
            layerId: marker._leaflet_id
          }})
      document.dispatchEvent(event)
    },
    loadExample (url) {
      var _this = this
      this.$http.get( url).then(
                    response => { _this.loadGraphMarkers(response.body); },
                    response => { _this.handleError(response);}
      );
    },
    loadGraphMarkers (geojson){
      var _this = this
      this.graphMarkers = L.geoJSON(geojson, {
        pointToLayer (feature, latlng) {
          var marker = new L.GraphMarker(
              latlng, 
              _this.selectedMarker,
              feature.properties.data,
              {api: _this.api})
          return marker
        }
      })
    }
  }
  
}

</script>

<style>
html,body{
  margin:0;
  padding:0;
  overflow-x: hidden;
}
.formater-fullscreen{
  position: fixed;
  top:0;
  left:0;
  width:100%;
  height:100vh;
  pointer-events:none;
}
.formater-map{
  position:relative;
  margin:0;
  padding:0;
}
.formater-map .geotiff-control{
  min-height:47px;
}
.formater-map.fullscreen{
  position:absolute;
  top:0;
  height:100vh;
  width:100%;
}
.formater-map > div{
  width:100%;
  position:relative;
}
.leaflet-reset{
  font-size: 22px;
}
.leaflet-bar.leaflet-colorscale {
  border:none;
}
.leaflet-colorscale-tooltip{
  display:block;
  padding:3px 3px;
  position:absolute;
  left:0;
  width:40px;
  text-align:center;
  top:-20px;
  font-size:12px;
  color:white;
  border-radius:5px;
  opacity:0;
  z-index:2000;
  background: rgba(0, 0, 0, 0.8);
  pointer-events: none;
  
}
.leaflet-colorscale canvas{
	width:100px;
	height:20px;
}
/** css leaflet.mode-control.js **/
.leaflet-control.leaflet-mode h4{
  margin:0;
  padding:0;
}
.leaflet-control.leaflet-mode a.leaflet-mode-toggle{
    margin: 0;
    border: none;
}
.leaflet-control.leaflet-mode-list {
 background:white;
 margin:0;
 border:none;
 padding: 5px
}
.leaflet-control input[type="radio"]{
 vertical-align:bottom;
}
.leaflet-control.leaflet-mode h4 {
  background: white;
  color:black;
  min-height:30px;
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
}
.leaflet-control.leaflet-mode h4 span{
  display:none;
  margin-left:5px;
}
.leaflet-control.leaflet-mode form{
  display:none;
}
.leaflet-control.leaflet-mode.leaflet-control-expanded h4,
.leaflet-control.leaflet-mode.leaflet-control-expanded h4 a {
  background: black;
  color:white;
}
.leaflet-control.leaflet-mode.leaflet-control-expanded h4 span{
  display:inline-block;
   margin-left:5px;
  margin-top: 5px;
}
.leaflet-control.leaflet-mode.leaflet-control-expanded form{
  display:block;
}
</style>