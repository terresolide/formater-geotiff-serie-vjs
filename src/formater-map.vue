<i18n>
{
   "en":{
       "wyn": 		"What is my name ?",
       "nobody" :	"Nobody",
       "mynameis":	"My name is"
   },
   "fr":{
       "wyn": 		"Quel est mon nom ?",
       "nobody" :	"Personne",
       "mynameis":	"Mon nom est"
   }
}
</i18n>

<template>
<span class="formater-map">
	<div :id="id"></div>
	</span>
</template>



<script>
var L = require("leaflet");
L.LeafletGeotiff = require("leaflet-geotiff-plotty");

export default {

  props:{
      id: {
          type: String,
          default:'map'
      },
      lang: {
          type: String,
          default: 'fr'
      }
      
  },
  data () {
		return {
  			pseudo: 'Truc',
  			map: null,
  			geotiff: null
		}
  },
 
  methods: {
		
	},
	
  created: function(){
      this.$i18n.locale = this.lang;
  },
  mounted: function(){
      // initialize the map
         var container = this.$el.querySelector("#" + this.id);

        // if( container){
		 this.map = L.map( container ).setView([19.963193897, -98.467355268], 5);
		
		// this.map.on( "zoom", function(e){ this.updateAllPolygons();})
		 L.tileLayer('//server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
			{
			  attribution: 'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
		      maxZoom: 18,
		      minZoom:2
		      
		    }).addTo( this.map );
		 var options = { displayMin:1, displayMax:10, clampLow:false,  clampHigh:true,colorScale:"rainbow", vector:false};
				 
		
		 var renderer = L.LeafletGeotiff.plotty(options);
		 var geotiff= L.leafletGeotiff("http://geotiff.test/geo_TOT_20150718.unw.tiff", {  opacity:1, renderer:renderer, band:0});
		  geotiff.addTo(this.map);
        // }
  }
}

</script>

<style>
.formater-map div{
   width:100%;
   height:500px;
   position:relative;
}
</style>