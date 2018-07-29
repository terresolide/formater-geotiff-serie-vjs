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
import GeotiffSerieControl from './geotiff-serie-control.vue';

// import FormaterDraggableBlock from './formater-draggable-block.vue';

import FormaterGraph from './formater-graph.vue';
// Add aeris-theme from other local repository!
import AerisTheme from '../../aeris-commons-components-vjs/src/aeris-theme/aeris-theme.vue';

ljs.addAliases({
    dep: [
       'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css', 
       //'https://use.fontawesome.com/releases/v5.1.0/css/all.css',
       // leaflet fontawesome marker
       //--------------------------
       //icon marker with font awesome CSS
       //-----------------------------
       'https://api.poleterresolide.fr/lib/awesome-marker/leaflet.awesome-markers.css',
       //leaflet css
       //------------
       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/leaflet.css',
       //regiter element
       //-------------
       'https://cdnjs.cloudflare.com/ajax/libs/document-register-element/1.4.1/document-register-element.js',
       'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment-with-locales.min.js',
       'https://cdnjs.cloudflare.com/ajax/libs/moment-range/3.0.3/moment-range.min.js'
      ]
})
ljs.load('dep', function() {
  Vue.customElement('formater-graph', FormaterGraph);
  Vue.customElement('aeris-theme', AerisTheme);
  Vue.customElement('geotiff-serie-control', GeotiffSerieControl);
  // Vue.customElement('formater-draggable-block', FormaterDraggableBlock)
  Vue.customElement('formater-map', Map);
  // Vue.customElement('formater-test', Test);
})

