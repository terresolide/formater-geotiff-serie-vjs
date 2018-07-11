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
	<div class="geotiff-control">
     <geotiff-visualizer :images="JSON.stringify(images)" :lang="lang"></geotiff-visualizer>
    </div>
	</span>
</template>

<script>
var L = require("leaflet")

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
  			images:[]
		}
  },
 
  methods: {
		
	},
	
  created () {
    this.$i18n.locale = this.lang
  },
  mounted () {
    this.$i18n.locale = this.lang
    console.log(this)
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
// 		 var options = { displayMin:-20, displayMax:10, clampLow:false,  clampHigh:true};
				 
		
// 		 var renderer = L.LeafletGeotiff.plotty(options);
// 		// console.log( renderer);
// 		 var geotiff= L.leafletGeotiff("http://geotiff.test/geo_TOT_20170818.unw.tiff", {   renderer:renderer, band:0, interactive:true});
// 		  geotiff.addTo(this.map);
		 
// 		  var imageBounds = [[18.568748337, -99.529022784], [19.963193897, -98.467355268]];

// 		  var imagegeo = L.imageOverlay(
// 				  "http://geotiff.test/geo_TOT_20170818.unw.png",
// 				  imageBounds,
// 				  {
// 					  crossOrigin:true,
// 					  zIndex:2000, 
// 					  opacity:0, 
// 					  interactive:true, 
// 					  bubblingMouseEvents:false,
// 					  alt: " mon geotiff"
// 			      });
// 		  console.log( imagegeo);
// ;		  imagegeo.addTo(this.map);
				  
// 		 // console.log( geotiff.options);
// 		  imagegeo.on('click', function(e){
// 			  //recherche de la valeur avec js
// 		      console.log( e.latlng);
// 			  var value = geotiff.getValueAtLatLng(e.latlng.lat,e.latlng.lng)
// 			  console.log( value);
// 		  })
        // }
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
    initImage () {
      
    },
    searchProfile () {
      console.log('searchProfile');
    }
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