<i18n>
{
   "en":{
       "wyn":         "What is my name ?",
       "nobody" :    "Nobody",
       "mynameis":    "My name is"
   },
   "fr":{
       "wyn":         "Quel est mon nom ?",
       "nobody" :    "Personne",
       "mynameis":    "Mon nom est"
   }
}
</i18n>

<template>
   <span class="formater-map">   
    <div :id="id"></div>
    <div class="geotiff-control">
     <geotiff-serie-control ref="geotiffControl" :images="JSON.stringify(images)" :lang="lang" showatstart="true" fullscreenbutton="true" @fullscreen="handleFullscreen" @resize="resize"></geotiff-serie-control>
    </div>
    </span>
</template>

<script>

var L = require("leaflet")
L.GeotiffSerieLayer = require("./leaflet.geotiff-serie-layer.js")
L.Control.ResetControl = require("./leaflet.reset-control.js")
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
      metadataUrl: {
          type: String,
          default: 'http://api.formater/geotiff/mexico/info.json'
      }
  },
  data () {
        return {
              pseudo: 'Truc',
              map: null,
              images:[],
              bounds: null,
              isFullscreen: false,
              fullscreenNode: null,
              parentNode: null
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
    // this.initListeners()
  },
  destroyed () {
    this.destroyFullscreen()
  },
  methods: {
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
      
      this.map.on('click', this.searchProfile);
    
    },
    initFullscreen () {
      var div = document.createElement('div')
      div.className = 'formater-fullscreen'
      this.fullscreenNode = div
      document.body.append(this.fullscreenNode)
      this.parentNode = this.$el.parentNode.parentNode
      
      this.parentNode.style.height = this.parentNode.offsetHeight + 'px'
      console.log(this.parentNode.style.height)
    },
    resize () {
      if (!this.$el || !this.$el.parentNode) {
        return
      }
     var parentPos = this.$el.parentNode.parentNode.getBoundingClientRect()
     var geotiffControlPos = this.$el.querySelector('.geotiff-control').getBoundingClientRect()
     console.log(parentPos.height)
     console.log(geotiffControlPos.height)
     console.log(this.$el.querySelector('.geotiff-control'))
     this.$el.querySelector('#' + this.id).style.height = (parentPos.height - geotiffControlPos.height) + 'px'
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
      this.$http.get( this.metadataUrl).then(
                    response => { _this.handleSuccess(response); },
                    response => { _this.handleError(response);}
      );
    },
    handleSuccess (resp){
       this.bounds = L.latLngBounds(
           [resp.body.bbox.north, resp.body.bbox.west], 
           [resp.body.bbox.south, resp.body.bbox.east])
       this.images = resp.body
     
       var reset = new L.Control.ResetControl(this.bounds)
       this.map.addControl(reset)
       this.geotiffSerie = new L.GeotiffSerieLayer(this.bounds)
       this.geotiffSerie.addTo(this.map)
       this.resize()
       //fitBounds after adding geotiffSerie else chrome do not zoom properly
       this.map.fitBounds(this.bounds)
       // this.$refs.geotiffControl.querySelector("#geotiffEye").dispatchEvent(event)
   	  
    },
    handleError (response) {
      console.log(response)
    },
    handleFullscreen (evt) {
      console.log(this.$refs.geotiffControl.offsetHeight)
      var nodePos = this.$el.querySelector('.geotiff-control').getBoundingClientRect()
      console.log(nodePos)
      if (this.isFullscreen) {
        this.parentNode.append(this.$el.parentNode)
        var height = this.parentNode.offsetHeight
	      console.log(height)
	     
	      this.$el.querySelector('#' +this.id).style.height = (height - nodePos.height) + 'px'
	      this.fullscreenNode.style.pointerEvents = 'none'
      }else{
	      console.log(evt)
	      this.fullscreenNode.append(this.$el.parentNode)
	      var height = window.innerHeight || document.documentElement.clientHeight
	      console.log(height)
	      this.$el.querySelector('#' +this.id).style.height = (height - nodePos.height) + 'px'
	      this.fullscreenNode.style.pointerEvents = 'auto'
      }
         this.isFullscreen = !this.isFullscreen
	      this.map.invalidateSize()
    },
    
    getProfile (evt) {
      console.log('searchProfile');
    },
   
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
</style>