require("exports-loader?!./l.min.js")

import Vue from 'vue';

import vueCustomElement from 'vue-custom-element';
Vue.use(vueCustomElement);

//pour la traduction 
import VueI18n from 'vue-i18n';
Vue.use(VueI18n);

import VueResource from 'vue-resource';
Vue.use(VueResource);

import Map from './formater-map.vue';
// import Test from './formater-test.vue';

//@todo factoriser -  Il s'agit du même composant (une copie) que dans formater-catalogue-component-vjs 
// problème quand je charge l'originale dans un autre répertoire avec i18n???
import GeotiffVisualizer from './geotiff-visualizer.vue';

ljs.addAliases({
	dep: [
	  'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css', 
		 //leaflet
		//------------
		'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/leaflet.css',
		//regiter element
		//-------------
	  'https://cdnjs.cloudflare.com/ajax/libs/document-register-element/1.4.1/document-register-element.js'
	  ]
})
ljs.load('dep', function() {
  Vue.customElement('geotiff-visualizer', GeotiffVisualizer);
  Vue.customElement('formater-map', Map);
	// Vue.customElement('formater-test', Test);
})

