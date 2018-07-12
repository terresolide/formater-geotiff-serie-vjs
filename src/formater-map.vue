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
     <geotiff-serie-control ref="geotiffControl" :images="JSON.stringify(images)" :lang="lang" showatstart="true"></geotiff-serie-control>
    </div>
    </span>
</template>

<script>
var L = require("leaflet")
L.geotiffSerieLayer = require("./leaflet.geotiff-serie-layer.js")
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
              bounds: null
        }
  },
  created () {
    this.$i18n.locale = this.lang
  },
  mounted () {
    this.$i18n.locale = this.lang
    this.initMap()
    this.getInfoSerie()
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
       this.map.fitBounds(this.bounds)
       this.geotiffSerie = new L.GeotiffSerieLayer(this.bounds)
       this.geotiffSerie.addTo(this.map)
       
       var event = new MouseEvent('click', {
        'view': window,
        'bubbles': true,
        'cancelable': true
       });
       console.log(this.$refs.geotiffControl.querySelector("#geotiffEye"))
       // this.$refs.geotiffControl.querySelector("#geotiffEye").dispatchEvent(event)
   	  
    },
    handleError (response) {
      console.log(response)
    },
    initGeotiffSerie (evt) {
       this.geotiffSerie = new L.GeotiffSerieLayer(evt.detail.img, this.bounds) 
       this.geotiffSerie.addTo(this.map)   
       var event = new MouseEvent('click', {
        'view': window,
        'bubbles': true,
        'cancelable': true
       });
       console.log(this.$refs.geotiffControl.querySelector("#geotiffEye"))
       this.$refs.geotiffControl.querySelector("#geotiffEye").dispatchEvent(event)
       console.log(this.$refs.geotiffControl)
       // trigger show in geotiff control 
    },
    
    getProfile (evt) {
      console.log('searchProfile');
    },
   
  }
  
}

</script>

<style>
.formater-map > div{
   width:100%;
   height:500px;
   position:relative;
}
</style>